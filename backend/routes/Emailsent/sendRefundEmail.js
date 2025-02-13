const nodemailer = require("nodemailer");

const sendRefundEmail = async (orderDetails, userEmail) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
  
    const mailOptions = {
      from: process.env.USER,
      to: userEmail,
      subject: `Refund Details for Your Order with TAHA FASHION`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f7f7f7; border-radius: 10px; max-width: 600px; margin: auto;">
          <div style="background-color:rgb(175, 76, 76); padding: 15px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0; font-size: 24px;">Refund Details </h2>
            <p style="margin: 0;">Refund ID: <strong>${orderDetails._id}</strong></p>
          </div>
  
          <div style="padding: 20px;">
            <h3 style="color: #4CAF50;">Refund Status</h3>
            <p><strong>Your refund request status has been updated to:</strong> ${orderDetails.Refund_status}</p>
  
            <h3 style="color: #4CAF50;">Refund Information</h3>
            <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
            <p><strong>Order Date:</strong> ${orderDetails.order_date}</p>
            <p><strong>Refund Date:</strong> ${orderDetails.refund_date}</p>
            <p><strong>Total Amount:</strong> ${orderDetails.totalAmount}</p>
  
            <h3 style="color: #4CAF50;">User Details</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Name:</strong> ${orderDetails.UserName}</li>
              <li><strong>Email:</strong> ${orderDetails.email}</li>
              <li><strong>Contact Number:</strong> ${orderDetails.contactnumber}</li>
              <li><strong>Address:</strong> ${orderDetails.address}</li>
              <li><strong>City:</strong> ${orderDetails.city}</li>
              <li><strong>State:</strong> ${orderDetails.state}</li>
              <li><strong>Zip Code:</strong> ${orderDetails.zipcode}</li>
            </ul>
  
            <h3 style="color: #4CAF50;">Product Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-top: 1px solid #ddd;">
              <thead style="background-color: #f2f2f2;">
                <tr>
                  <th style="padding: 10px; text-align: left;">Product Name</th>
                  <th style="padding: 10px; text-align: left;">Quantity</th>
                  <th style="padding: 10px; text-align: left;">Price</th>
                  <th style="padding: 10px; text-align: left;">Size</th>
                </tr>
              </thead>
              <tbody>
                ${orderDetails.products.map(product => `
                  <tr>
                    <td style="padding: 10px; border-top: 1px solid #ddd;">${product.product_name}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd;">${product.quantity}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd;">${product.price}</td>
                    <td style="padding: 10px; border-top: 1px solid #ddd;">${product.selectedSize}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
  
            <h3 style="color: #4CAF50;">Payment Details</h3>
            <ul style="list-style-type: none; padding-left: 0;">
              <li><strong>Method:</strong> ${orderDetails.paymentMethod}</li>
              ${orderDetails.paymentDetails.map(payment => `
                <li><strong>Payment Status:</strong> ${payment.paymentStatus}</li>
                <li><strong>Payment ID:</strong> ${payment.payment_id}</li>
                <li><strong>Payment Date:</strong> ${payment.paymentDate}</li>
                <li><strong>Payment Method:</strong> ${payment.method || null }</li>
              <li><strong>Payment Bank:</strong> ${payment.bank || null }</li>
              <li><strong>Payment Wallet:</strong> ${payment.wallet || null }</li>
              <li><strong>Payment UPI:</strong> ${payment.vpa || null }</li>
              `).join('')}
            </ul>
  
            <div style="text-align: center; padding: 20px;">
              <a href="${process.env.FROAPI}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                Shop Again
              </a>
            </div>
  
            <p style="font-size: 16px; line-height: 1.6; text-align: center;">We appreciate your business and look forward to serving you again!</p>
          </div>
  
          <footer style="background-color: #f2f2f2; text-align: center; padding: 10px; font-size: 14px; color: #777; border-radius: 0 0 10px 10px;">  
            <p><strong>TAHA FASHION</strong></p>
          </footer>
        </div>
      `,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email: " + error);
    }
  };

module.exports = sendRefundEmail;
