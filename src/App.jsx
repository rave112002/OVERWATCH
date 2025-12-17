import { message, notification } from "antd";
import { MessageContext, NotifContext } from "@helpers/message-context";
import Routers from "./routes";
import { MapStyleProvider } from "@helpers/MapStyleProvider";

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, contextHolderNotif] = notification.useNotification();

  return (
    <>
      {contextHolder}
      {contextHolderNotif}
      <MessageContext.Provider value={messageApi}>
        <NotifContext.Provider value={notificationApi}>
          <MapStyleProvider>
            <Routers />
          </MapStyleProvider>
        </NotifContext.Provider>
      </MessageContext.Provider>
    </>
  );
}

export default App;
