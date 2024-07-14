import {
  Button,
  Rows,
  Text,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  CogIcon,
  PencilIcon,
} from "@canva/app-ui-kit";
import styles from "styles/components.css";
import { SettingsTab } from "./components/SettingsTab";
import { CreateTab } from "./components/CreateTab";
import { useState } from "react";

export const App = () => {
  const [playHTCred, setPlayHTCred] = useState<PlayHTCredentials>({
    userId: "",
    secretKey: "",
    audio: "",
    gender: "male",
  });

  return (
    <div className={styles.scrollContainer}>
      <Tabs>
        <Rows spacing="2u">
          <TabList>
            <Tab id="create" start={<PencilIcon />}>
              Create
            </Tab>
            <Tab id="settings" start={<CogIcon />}>
              Settings
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="create">
              <CreateTab
                playHTCred={playHTCred}
                setPlayHTCred={setPlayHTCred}
              />
            </TabPanel>
            <TabPanel id="settings">
              <SettingsTab
                playHTCred={playHTCred}
                setPlayHTCred={setPlayHTCred}
              />
            </TabPanel>
          </TabPanels>
        </Rows>
      </Tabs>
    </div>
  );
};
