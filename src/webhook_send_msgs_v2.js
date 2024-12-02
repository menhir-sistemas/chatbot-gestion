const IS_TEST = user.get("botmakerEnvironment") === "DEVELOPMENT";
const botmakerToken = "eyJhbGciOiJIUzUxMiJ9.eyJidXNpbmVzc0lkIjoiZ2VzdGlvbiIsIm5hbWUiOiJHZXN0aW9uIiwiYXBpIjp0cnVlLCJpZCI6IlNhc2k3M2hqWGFnVmhRZ09yd2QxTW5oOEFnWjIiLCJleHAiOjE4ODE4NTI4OTQsImp0aSI6IlNhc2k3M2hqWGFnVmhRZ09yd2QxTW5oOEFnWjIifQ.4QgGGWc1wColZGuXcV2kzARzChUKo251aFhzEx_suSmdwiGwfITr3RBkcnaR2OHqKS6-kqUriWKSI9flXdiWrg";
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

const saveChat = async () => {
  const chatChannel = context.userData.CHAT_CHANNEL_ID;
  const chatPlatform = context.userData.CHAT_PLATFORM_ID.toUpperCase();

  const channelId = chatChannel.slice("-")[2];
  const chatId = context.message.CUSTOMER_ID;

  const options = {
    method: "GET",
    uri: "https://api.botmaker.com/v2.0/messages",
    qs: {
      "channel-id": channelId,
      "chat-id": chatId,
      "chat-platform": chatPlatform,
      "from" : moment(context.message.SESSION_CREATION_TIME).utc().toISOString(),
      "to" : moment.utc().toISOString(),
    },
    headers: {
      "Content-Type": "application/json",
      "access-token": botmakerToken,
    },
    json: true,
  };

  return rp(options);
};

const createBody = async () => {
  const response = await saveChat();
  bmconsole.log(response)
  const messages = response.items;
  let json;
  let lista = [];
  for (let i = 0; i < messages.length; i++) {
    const msj = messages[i].content.text || messages[i].content.selectedButton;
    const date = moment(messages[i].creationTime)
      .utc()
      .utcOffset(-5)
      .format("DD/MM/YYYY HH:mm");
    const template = messages[i].content.whatsAppTemplateName;
    json = {
      date: messages[i].creationTime, //date,
      fromName:
        messages[i].from == "user" ? getName() : messages[i].from,
      _id_: messages[i].id,
      from: messages[i].from,
      message: template ? template + msj : msj,
      file:
        messages[i].content.type !== "text" &&
        messages[i].content.type !== "buttons" &&
        messages[i].content.type !== "button-click"
          ? messages[i].content.media && messages[i].content.media.url
          : undefined,
      operatorId:
        messages[i].from == "operator"
          ? context.userData.CURRENT_OPERATOR_EMAIL
          : undefined,
      fromCustomer: messages[i].from == "user" ? true : false,
      //whatsappReferral: context.message.FROM,
      //whatsappReferral: {},
    };
    lista.push(json);
  }
  //agregamos como ultimo mensaje el id de la sesion
  lista.unshift({ ...lista[lista.length-1] }); // copiamos el ultimo elemento
  lista[0].message = ("id_session_para_BI: "+context.userData._id_ + "_" + context.message.SESSION_CREATION_TIME);// le ponemos de texto el id de la sesion
  lista[0].fromCustomer = true;
  lista[0].from = 'user';
  lista[0].date = new Date();
  lista[0]._id_ = lista[lista.length-1]._id_+1;
  //result.text(JSON.stringify( lista[lista.length-1]))
  return lista;
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
