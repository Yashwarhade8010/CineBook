const pdfDocument = require("pdfkit")
const fs = require("fs");


const handleGeneratePdfInvoice = async(ticketId,username,seats,totalAmount)=>{
    
    try{
        const pdfPath = `invoice-${ticketId}.pdf`;
        const doc = new pdfDocument()
        doc.pipe(fs.createWriteStream(pdfPath));
        doc.fontSize(40).text("CINEBOOK",{align:"center"});
        doc.moveDown();
        doc.fontSize(20).text("Invoice",{align:"center"})
        doc.moveDown();
        doc.text(`TicketId: ${ticketId}`)
        doc.fontSize(14).text(`Name: ${username}`)

        const seatText = (seats.length>1)? 'Seats: ':'Seat: '
        let seatsToShow = []
        seats.forEach((seat)=>{seatsToShow.push(`${seat.row}${seat.number}`)})
        doc.text(`${seatText}${seatsToShow}`)

        doc.text(`Amount: ${totalAmount}`)
        doc.text(`Date: ${new Date().toLocaleString()}`)
        doc.moveDown();
        doc.text("Thanks for Booking with us",{align:"center"})
        doc.end()
        return pdfPath;
    }catch(err){
        console.log(err)
    }
}

module.exports = handleGeneratePdfInvoice;