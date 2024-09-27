import Image from "next/image";
import styles from "./page.module.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Page from "./modules/merchant/page";
import DasboardLayoutAccount from "./modules/dashboard/layout";

export default function Home() {
  return (
    <div>
      <DasboardLayoutAccount>
        
      </DasboardLayoutAccount>
     
   </div>
  );
}
