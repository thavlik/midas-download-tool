const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('https');
const child_process = require('child_process');

const mkdirp = async dir => {
    if (fs.existsSync(dir)) {
        return;
    }
    console.log(`Creating ${dir}`);
    fs.mkdirSync(dir);
};

const getFolders = page => page.$$eval('.browsecommunity .right .title a', elements => {
    return elements.map(e => ({ name: e.innerHTML, url: e.href }));
});

const getFiles = async page => {
    const files = await page.$$eval('#list tbody tr .metadata a.name', elements => {
        return elements.map(e => ({ name: e.innerHTML, url: e.href }));
    });
    let checksums = await page.$$eval('#list tbody tr .metadata .checksum a', elements => {
        return elements.map(e => ({ name: e.innerHTML, url: e.href }));
    });
    if (files.length != checksums.length) {
        throw new Error(`files and checksum length mismatch ${files.length} and ${checksums.length}`);
    }
    checksums = checksums.map((hash, i) => ({ name: files[i].name + '.md5', url: hash.url }));
    return files.concat(checksums);
};

const downloadParseError = new Error('parse error');

const downloadFile = async (dest, url) => new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
        console.log(`Skipping ${dest}`);
        resolve();
        return;
    }
    console.log(`Downloading ${dest} from ${url}`);
    child_process.execSync(`curl ${url} -o \"${dest}\"`);
    resolve();
    return;

    const start = Date.now();
    const file = fs.createWriteStream(dest);
    http.get(url, (response) => {
        if (response.statusCode != 200) {
            return reject(`received status code ${response.statusCode}`);
        }
        const elapsed = Date.now() - start;
        console.log(`Downloaded ${dest} in ${elapsed / 1000.0} seconds`);
        file.on('finish', () => {
            file.close();
            resolve();
        }).on('error', err => {
            fs.unlinkSync(dest);
            reject(err);
        });
        response.pipe(file);
    }).on('error', err => {
        fs.unlinkSync(dest);
        if (typeof err.message == 'string' &&
            err.message == 'Parse Error') {
            return reject(downloadParseError);
        }
        reject(err);
    });
});

const maxDownloadAttempts = 3;
const retryDelay = 3000;

const processPage = async (page, dest, url) => {
    console.log('Processing ' + url);
    await mkdirp(dest);
    const start = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#footer');
    console.log(`Page loaded in ${(Date.now() - start) / 1000} seconds`);

    const files = await getFiles(page);
    let attempt = 0;
    for (var i = 0; i < files.length; i++) {
        const file = files[i];
        const fileDest = path.join(dest, file.name);
        try {
            await downloadFile(fileDest, file.url);
        } catch (err) {
            if (err == downloadParseError) {
                if (attempt >= maxDownloadAttempts) {
                    console.log(`skipping ${fileDest} due to failure: ${err.message}`);
                    break;
                }
                console.log(`failed to download ${fileDest}, attempt ${attempt + 1}/${maxDownloadAttempts}, retrying after ${retryDelay}ms...`);
                --i;
                ++attempt;
                // try again after a short delay
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                continue;
            }
            throw err;
        }
        attempt = 0;
    }
    const folders = await getFolders(page);
    for (var folder of folders) {
        await processPage(page, path.join(dest, folder.name), folder.url);
    }
};

(async () => {
    //await downloadFile('md5', 'https://www.insight-journal.org/midas/bitstream/keyfile/94523372178c72f9e00a8ef705430aa2');
    //console.log('it worky');
    const url = 'https://insight-journal.org/midas/community/view/21';
    console.log('Download dataset from ' + url);
    const opts = {
        timeout: 10000,
    };
    if (process.env.NO_SANDBOX == '1') {
        // ONLY pass this option if you're running this script in Docker.
        // Otherwise, it is a considerable and unnecessary security risk.
        opts.args = ['--no-sandbox'];
    }
    const browser = await puppeteer.launch(opts);
    const page = await browser.newPage();
    const root = process.argv.length > 2 ? process.argv[2] : 'download';
    console.log(`Using download dir ${root}`);
    await mkdirp(root);
    try {
        await processPage(page, root, url);
    } catch (err) {
        debugger;
        throw err;
    }
    await page.screenshot({ path: 'example.png' });
    await browser.close();
})();