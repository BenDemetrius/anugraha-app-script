/*
 *
 *  Send WhatsApp with Google Sheets
 *  ================================
 *
 *  Written by Amit Agarwal
 *  Google Developer Expert - Google Apps Script
 *
 *  Email: amit@labnol.org
 *  Web: https://digitalinspiration.com/
 *
 */

const WHATSAPP_ACCESS_TOKEN = "<<your token here>>";
const WHATSAPP_TEMPLATE_NAME = "<<your template name here>>";
const LANGUAGE_CODE = "en";

const sendMessage_ = ({ recipient_number, member_name, event_date }) => {
  const apiUrl = "https://graph.facebook.com/v13.0/114746974570888/messages";
  const request = UrlFetchApp.fetch(apiUrl, {
    muteHttpExceptions: true,
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      messaging_product: "whatsapp",
      type: "template",
      to: recipient_number,
      template: {
        name: WHATSAPP_TEMPLATE_NAME,
        language: { code: LANGUAGE_CODE },
        components: [
          {
            type: "body",
            parameters: [
              {
                type: "text",
                text: member_name,
              },
              {
                type: "text",
                text: event_date,
              },
            ],
          },
        ],
      },
    }),
  });

  const { error } = JSON.parse(request);
  const status = error
    ? `Error: ${JSON.stringify(error)}`
    : `Message sent to ${recipient_number}`;
  Logger.log(status);
};

const getSheetData_ = () => {
  const [header, ...rows] = SpreadsheetApp.getActiveSheet()
    .getDataRange()
    .getDisplayValues();
  const data = [];
  rows.forEach((row) => {
    const recipient = {};
    header.forEach((title, column) => {
      recipient[title] = row[column];
    });
    data.push(recipient);
  });
  return data;
};

const main = () => {
  const data = getSheetData_();
  data.forEach((recipient) => {
    const status = sendMessage_({
      recipient_number: recipient["Phone Number"].replace(/[^\d]/g, ""),
      member_name: recipient["Member Name"],
      event_date: recipient["Event Date"],
    });
  });
};
