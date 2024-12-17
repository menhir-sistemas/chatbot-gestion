const IS_TEST = user.get("botmakerEnvironment") === "DEVELOPMENT";
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getName = () => {
  if (context.userData.FIRST_NAME) {
    if (context.userData.LAST_NAME)
      return (
        context.userData.FIRST_NAME.trim() +
        " " +
        context.userData.LAST_NAME.trim()
      );
    else return context.userData.FIRST_NAME.trim();
  } else {
    return context.userData.FIRST_NAME.trim();
  }
};


const createBody = async () => {

  const msj = context.params.codDocumento ?? '-=[Error: mensaje vacío]=-';
  bmconsole.log(response)
  const messages = response.items;
  const date = moment(messages[i].creationTime)
    .utc()
    .utcOffset(-5)
    .format("DD/MM/YYYY HH:mm");
  const template = messages[i].content.whatsAppTemplateName;
  let json = {
    date: date,
    fromName: messages[i].from == "user" ? getName() : messages[i].from,
    //_id_: messages[i].id,
    //from: messages[i].from,
    message: msj,
    file: undefined,
    /*
    file:
      messages[i].content.type !== "text" &&
      messages[i].content.type !== "buttons" &&
      messages[i].content.type !== "button-click"
        ? messages[i].content.media && messages[i].content.media.url
        : undefined,*/
    operatorId: context.userData.CURRENT_OPERATOR_EMAIL,
    fromCustomer: true,//messages[i].from == "user" ? true : false,
    //whatsappReferral: context.message.FROM,
    //whatsappReferral: {},
  };
  return [json];
};

// Main Block
const main = async () => {
  //result.text(context.userData._id_ + "_" + context.message.SESSION_CREATION_TIME)
  const mensajes = await createBody();
  let number = context.userData.CHAT_CHANNEL_ID;
  try {
    // TODO: solo para WA
    let parts = number.split('-');
    number = parts[2];
  } catch (error) {
    number = "5491128738960";
  }

  bmconsole.log(number);
  let payload = {
    lastName: context.userData.LAST_NAME,
    chatPlatform: context.userData.CHAT_PLATFORM_ID,
    customerCreationTime: context.message.CREATION_TIME,
    contactId: context.userData.PLATFORM_CONTACT_ID,
    type: "message",
    whatsappNumber: number,
    firstName: context.userData.FIRST_NAME,
    sessionCreationTime: context.message.SESSION_CREATION_TIME,
    v: "1.1",
    sessionId: context.userData._id_ + "_" + context.message.SESSION_CREATION_TIME,
    customerId: context.message.CUSTOMER_ID,
    messages: mensajes,
    chatChannerlId: context.userData.CHAT_CHANNEL_ID,
  };
  const options = {
    method: "POST",
    uri: "https://s2.pyzen.com/NeoWebhook/api/Botmaker/IncomeV2",
    body: payload,
    json: true,
  };
  const res = await rp(options);
  bmconsole.log("[STATUS] " + JSON.stringify(res));
};

main()
  .catch((err) => {
    // Code on error
    if (IS_TEST) {
      result.text(`[ERROR] : ${err.message}`);
    }
    bmconsole.error(`[ERROR]: ${err.message}`);
  })
  .finally(() => {
    // Code on finish
    result.done();
  });
