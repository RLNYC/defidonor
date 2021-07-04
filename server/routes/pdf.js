const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require("fs");
const path = require("path");
const express = require('express');
const router = express.Router();
const { NFTStorage, File } = require('nft.storage');

require('dotenv').config();
const client = new NFTStorage({ token: process.env.NFTSTORAGE_APIKEY })

async function rewritePdf(sponsoringOrganization, dateOfDonation, sentAddress, receiveAddress, assets, totalAssetValues){
    const existingPdfBytes = fs.readFileSync(path.join(__dirname, "../recepit.pdf"));

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    const size = 15
    const color = rgb(1, 0.54, 0.36);

    firstPage.drawText(sponsoringOrganization, {
        x: 255,
        y: height / 2 + 232,
        size: size,
        font: helveticaFont,
        color: color
    });

    firstPage.drawText(dateOfDonation, {
        x: 210,
        y: height / 2 + 197,
        size: size,
        font: helveticaFont,
        color: color
    });

    firstPage.drawText(sentAddress, {
        x: 185,
        y: height / 2 + 161,
        size: size,
        font: helveticaFont,
        color: color
    });

    firstPage.drawText(receiveAddress, {
        x: 205,
        y: height / 2 + 125,
        size: size,
        font: helveticaFont,
        color: color
    });

    firstPage.drawText(assets, {
        x: 140,
        y: height / 2 + 88,
        size: size,
        font: helveticaFont,
        color: color
    });

    firstPage.drawText(totalAssetValues, {
        x: 220,
        y: height / 2 + 53,
        size: size,
        font: helveticaFont,
        color: color
    });

    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}
// POST /api/pdf/createreceipt
// Create a receipt and upload it to nft.storage
router.post('/createreceipt', async (req, res) => {
    const sponsoringOrganization = req.body.sponsoringOrganization;
    const dateOfDonation = new Date().toISOString();
    const sentAddress= req.body.sentAddress;
    const receiveAddress= req.body.receiveAddress;
    const assets = req.body.assets;
    const totalAssetValues= req.body.totalAssetValues;

    const pdfFile = await rewritePdf(sponsoringOrganization, dateOfDonation, sentAddress, receiveAddress, assets, totalAssetValues);

    const cid = await client.storeDirectory([
        new File([pdfFile], 'receipt.pdf'),
        new File([JSON.stringify(
            { sponsoringOrganization, dateOfDonation, sentAddress, receiveAddress, assets, totalAssetValues },
            null,
            2
        )], 'metadata.json')
    ])

    return res.status(201).json({
        cid: cid,
        url: `https://ipfs.io/ipfs/${cid}`,
        data: { sponsoringOrganization, dateOfDonation, sentAddress, receiveAddress, assets, totalAssetValues }
    });
})

module.exports = router;