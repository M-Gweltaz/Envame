//  Importing packages
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Newsletter = require('../model/Newsletter');
const { body, validationResult } = require('express-validator');

// Homepage ROOT
router.get('/', (req, res) => {
  res.render('homepage')
});

// Newsletter PATH
router.post('/newsletter', [
  // data sanitization and validation
  body('newsletterEmail')
    .isEmail().withMessage('Veuillez renseigner un email valide')
    .normalizeEmail()
], async (req, res) => {
  let fetchResult // result of the request to be send as Json

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    fetchResult = 'badInput'
    return res.status(400).json({ errors: errors.array(), fetchResult });
  }

  const data = req.body

  // Finding if user email is already in DB
  // let isFound
  // try {
  //   let isFound = await Newsletter.find({ email: data.newsletterEmail })
  // } catch (err) {
  //   fetchResult = 'error'
  //   res.status(500).json({ message: err.message, fetchResult })
  // }

  //  Saving user email to db

  try {
    const isFound = await Newsletter.find({ email: data.newsletterEmail })
    if(isFound != ''){
      fetchResult = 'failed'
    } else {
      const newsletter = new Newsletter({ email: data.newsletterEmail });
      const savedNewsletter = await newsletter.save()
      fetchResult = 'success'
    }
  } catch (err) {
    fetchResult = 'error'
    res.status(500).json({ message: err.message, fetchResult })
  }

  // sending welcoming Newsletter
  // mail input
  const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG/>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <title>Envame Newsletter</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8"
      />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      <!--[if !mso]>
        <!-->
        <link href="https://fonts.googleapis.com/css?family=Pathway+Gothic+One&amp;subset=latin-ext"
        rel="stylesheet" />
  
      <!--<![endif]-->
      <style type="text/css">
        body {
          margin: 0 !important;
          padding: 0 !important;
          -webkit-text-size-adjust: 100% !important;
          -ms-text-size-adjust: 100% !important;
          -webkit-font-smoothing: antialiased !important;
        }
        img {
          border: 0 !important;
          outline: none !important;
        }
        p {
          Margin: 0px !important;
          Padding: 0px !important;
        }
        table {
          border-collapse: collapse;
          mso-table-lspace: 0px;
          mso-table-rspace: 0px;
        }
        td, a, span {
          border-collapse: collapse;
          mso-line-height-rule: exactly;
        }
        .ExternalClass * {
          line-height: 100%;
        }
        .em_defaultlink a {
          color: inherit !important;
          text-decoration: none !important;
        }
        span.MsoHyperlink {
          mso-style-priority: 99;
          color: inherit;
        }
        span.MsoHyperlinkFollowed {
          mso-style-priority: 99;
          color: inherit;
        }
        .em_grey a {
          color: #7e6f63;
          text-decoration: none !important;
        }
        .em_greyA a {
          color: #000;
          text-decoration: none;
        }
        
        @media only screen and (min-width:481px) and (max-width:599px) {
        .em_main_table {
          width: 100% !important;
        }
        .em_wrapper {
          width: 100% !important;
        }
        .em_side {
          width: 10px !important;
        }
        .em_hide {
          display: none !important;
        }
        .em_img {
          width: 100% !important;
          height: auto !important;
        }
        .em_center {
          text-align: center !important;
        }
        .em_h20 {
          height: 20px !important;
        }
        .em_top {
          padding-top: 20px !important;
        }
        .em_padd {
          padding: 20px 10px 0px 10px !important;
        }
        .em_text2 {
          font-size: 55px !important;
          line-height: 58px !important;
        }
        .em_paddd {
          padding: 0px !important;
        }
        }
        
        @media screen and (max-width: 480px) {
        .em_main_table {
          width: 100% !important;
        }
        .em_wrapper {
          width: 100% !important;
        }
        .em_side {
          width: 10px !important;
        }
        .em_hide {
          display: none !important;
        }
        .em_img {
          width: 100% !important;
          height: auto !important;
        }
        .em_center {
          text-align: center !important;
        }
        .em_h20 {
          height: 20px !important;
        }
        .em_top {
          padding-top: 20px !important;
        }
        .em_padd {
          padding: 20px 10px 0px 10px !important;
        }
        u + .em_body .em_full_wrap {
          width: 100% !important;
          width: 100vw !important;
        }
        .em_text1 {
          font-size: 23px !important;
          line-height: 30px !important;
        }
        .em_text2 {
          font-size: 35px !important;
          line-height: 38px !important;
        }
        .em_text3 {
          font-size: 21px !important;
          line-height: 21px !important;
        }
        .em_paddd {
          padding: 0px !important;
          font-size: 12px !important;
          line-height: 16px !important;
        }
        }
      </style>
    </head>
    
    <body class="em_body" style="margin:0px; padding:0px;">
  
      <table
      width="100%" border="0" cellspacing="0" cellpadding="0" class="em_full_wrap">
        <tr>
          <td align="center" valign="top">
            <table align="center" width="600" border="0" cellspacing="0" cellpadding="0" class="em_main_table"
            style="width:600px; table-layout:fixed;">

              <!--Body Content Section-->
              <tr>
                <td valign="top" align="center" bgcolor="#ffffff" style="padding:35px 18px 0px"
                class="em_padd">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td class="em_greyA em_text3" align="center" valign="top" style="font-family:'DINCond', 'Trebuchet MS', Arial, Helvetica, sans-serif; font-size:20px; line-height:28px; color:#000;">
                        <a href="https://envame.com" target="_blank" style="text-decoration:none; color:#000;"><span style="font-family:Arial, sans-serif; font-size:35px; line-height:50px; color:#3898ef; text-transform:uppercase; max-width:600px;">Merci pour votre inscription</span>
                          <br />
                          <br />
                          <br />
                          <br class="em_hide" />Dans la période actuelle, il n'est plus aussi simple de se rendre dans son institut de beauté préféré pour recevoir ses soins favoris.
                          <br />
                          <br />Bénéficier en cadeau d'un MUST HAVE : 1 lot de 7 masques tissus éco-luxe coup d'éclat/hydratant.
                          <nobr>Offert avec votre code:</nobr>
                          <br /><span style="color:#3898ef">ENVAMESPA2.0</span>
                          <br />
                          <br />Avertissement :
                          <br class="em_hide"
                          />Préparez-vous, car dans 90 jours, les résultats auront dépassés toutes vos espérances.</a>
                      </td>
                    </tr>
                    <tr>
                      <td height="31" style="font-size:0px; line-height:0px; height:31px;" class="em_h20">&nbsp;</td>
                    </tr>
                    <tr>
                      <td valign="top" align="center">
                        <table align="center" border="0" cellspacing="0" cellpadding="0" style="border-radius:3px; background-color:#3898ef;">
                          <tr>
                            <td height="52" align="center" valign="middle" style="font-family:'DINCondensed', 'Trebuchet MS', Arial, Helvetica, sans-serif; font-size:15px; color:#ffffff; background-color:#3898ef; font-weight:bold; text-transform:uppercase; text-decoration: none; height:52px; padding:0px 24px;">
                              Pré-commander : <span style="color:#ffffff; text-decoration:none">envamepro@gmail.com</span>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td height="38" style="font-size:0px; line-height:0px; height:38px;" class="em_h20">&nbsp;</td>
                    </tr>
                    <tr>
                      <td align="center" valign="top">
                        <table width="485" border="0" cellspacing="0" cellpadding="0" align="center" style="width:485px;"
                        class="em_wrapper">
                          <tbody>
                            <tr>
                              <td height="1" style="font-size:0px; line-height:0px; height:1px;" bgcolor="#efeeec">&nbsp;</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!--//Body Content Section-->
              <!--Footer Section-->
              <tr>
                <td valign="top" align="center" style="padding:30px 45px 28px;" class="em_padd">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td class="em_gray em_paddd" align="center" valign="top" style="font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#7e6f63; padding:0px 20px;"> <span>*Offre limité a un usage par client. Ce code est à utiliser lors de votre première commande du masque envame SPA 2.0, disponible directement sur notre site internet envame.com.
                        <br
                        />
                        <br />
                      </td>
                    </tr>
                    <tr>
                      <td height="35" style="font-size:0px; line-height:0px; height:35px;" class="em_h20">&nbsp;</td>
                    </tr>
                    <tr>
                      <td valign="top" align="center">
                        <table align="center" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td valign="middle" align="center">
                              <a href="https://www.facebook.com/envameofficielen/" target="_blank" style="text-decoration:none;">
                                <img src="https://gen-pub-ent-sessionm-com.s3.amazonaws.com/email/images/d057b2c9-02c7-4b3a-8ea3-7ed68eb95fcb/CHP%2019%20Q3%20Delivery%20Spree%20-%20Email%205%20Education/0e9bc9ad0d575241045caa841ddcad9356b786b64dbd7f4663b5a5284087c7e2b3c704c1ebd58dca8524d4c9864fa70370f41faec17f73c2417348c92e325529.png" alt="FACEBOOK" width="50" class="w50px">
                              </a>
                            </td>
                            <td width="20" style="width:20px;">&nbsp;</td>
                            <td valign="middle" align="center">
                              <a href="https://www.instagram.com/accounts/login/?next=/zoeskitchen/" target="_blank"
                              style="text-decoration:none;">
                                <img src="https://gen-pub-ent-sessionm-com.s3.amazonaws.com/email/images/d057b2c9-02c7-4b3a-8ea3-7ed68eb95fcb/CHP%2019%20Q3%20Delivery%20Spree%20-%20Email%205%20Education/5f9d5c2d3b0ca34ae194be2761da55d9acda96ede0101c1fd7bbc31ea11a2036dfccfe74cbac64ef9e1f48d2e93f3e6122e48ecc0bd2b563bafbefda8122cee6.png" alt="Instagram" width="50" class="w50px">
                              </a>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="em_h20" height="38" style="font-size:0px; line-height:0px; height:38px;">&nbsp;</td>
                    </tr>
                    <tr>
                      <td class="em_gray em_paddd" align="center" valign="top" style="font-family:Helvetica, Arial, sans-serif; font-size:12px; line-height:20px; color:#000; padding:0px 20px;">Cet e-mail vous a été envoyé suite à votre inscription a notre newsletter via notre site internet.
                        Votre adresse e-mail ne sera jamais partagée et uniquement utilisée par la société Envame.
                        Si vous le désirez, vous pouvez vous désabonner en tout instant en cliquant sur le lien désabonnement ci-dessous.
                        <br />
                        <br /> <strong>&copy; 2020 Envame. Tout droit réservé</strong>
                        <br />
                        <br />
                        <a href="https://www.envame.com/newsletter_unsubscribe"
                        target="_blank" style="text-decoration:underline; color:#000;"><strong>Se désabonner</strong>
                        </a>
  
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!--//Footer Section-->
              <tr>
                <td class="em_hide" style="line-height:1px;min-width:600px;background-color:#ffffff;">
                  <img alt="" src="https://s3.amazonaws.com/zk-email-media/global/trigger/spacer.gif"
                  height="1" width="600" style="max-height:1px; min-height:1px; display:block; width:600px; min-width:600px;"
                  border="0" />
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" valign="top">&nbsp;</td>
        </tr>
        </table>
        <div class="em_hide" style="white-space: nowrap; display: none; font-size:0px; line-height:0px;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp;</div>
      
    </body>
  
  </html>`

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'node9-fr.n0c.com',
    port: 465,
    secure: true, // true for 465, false for other ports (587)
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASSWORD, 
    },
  });

  // send mail with defined transport object
  let mailOption = {
    from: '"Envame newsletter" <contact@envame.com>', // sender address
    to: data.newsletterEmail, // list of receivers
    subject: 'Bienvenue, découvrez votre code cadeau envame et bien plus !', // Subject line
    text: 'Hello world?', // plain text body
    html: output, // html body
  };

  // sending welcome newsletter email
  transporter.sendMail(mailOption);

  res.json({
    status : fetchResult,
    userEmail : data.newsletterEmail
  })
});

router.get('/newsletter_unsubscribe', (req, res) => {
  res.render('unsubscribe')
})

router.put('/newsletter_unsubscribe', [
  // data sanitization and validation
  body('userEmail')
    .isEmail().withMessage('Veuillez renseigner un email valide')
    .normalizeEmail()
], async (req, res) => {
  let deleteResult // result of the request to be send as Json

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteResult = 'badInput'
    return res.status(400).json({ errors: errors.array(), deleteResult });
  }

  const data = req.body

  try {
    // Finding user email from DB
    const isFound = await Newsletter.find({ email: data.userEmail })
    
    if(isFound != ''){
      // Deleting user email from DB
      const deletedNewsletter = await Newsletter.deleteOne({email: data.userEmail })
      deleteResult = 'success'
    }else {
      deleteResult = 'failed'
    }
  } catch (err) {
    deleteResult = 'error'
    res.status(500).json({ message: err.message, deleteResult})
  }

  // sending json res for browsers
  res.json({
    status : deleteResult
  })
});

module.exports = router;
