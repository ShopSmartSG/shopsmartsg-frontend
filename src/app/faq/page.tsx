/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

import { Badge } from "primereact/badge";

const page = () => {
  return (
    <div className="card">
      <Accordion activeIndex={0}>
        <AccordionTab
          header={
            <span className="flex align-items-center gap-2 w-full">
              <span className="font-bold white-space-nowrap">Customer</span>
              <Badge value="6" className="ml-auto" />
            </span>
          }
        >
          <ul>
            <li>
              <strong>Q: How do I create an account?</strong>
              <p>
                A: To create an account, click on the "Sign Up" button at the
                top right corner and fill in the required details.
              </p>
            </li>
            <li>
              <strong>Q: How can I reset my password?</strong>
              <p>
                A: Click on "Forgot Password" on the login page and follow the
                instructions to reset your password.
              </p>
            </li>
            <li>
              <strong>Q: What payment methods are accepted?</strong>
              <p>
                A: We accept various payment methods including credit/debit
                cards, PayPal, and bank transfers.
              </p>
            </li>
            <li>
              <strong>Q: How do I track my order?</strong>
              <p>
                A: You can track your order by logging into your account and
                visiting the "Order History" section.
              </p>
            </li>
            <li>
              <strong>Q: Can I return or exchange an item?</strong>
              <p>
                A: Yes, you can return or exchange items within 30 days of
                purchase. Please visit our "Returns and Exchanges" page for more
                details.
              </p>
            </li>
            <li>
              <strong>Q: How do I contact customer support?</strong>
              <p>
                A: You can contact our customer support team via the "Contact
                Us" page or by calling our support hotline.
              </p>
            </li>
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <span className="flex align-items-center gap-2 w-full">
              <span className="font-bold white-space-nowrap">Admin</span>
              <Badge value="6" className="ml-auto" />
            </span>
          }
        >
          <ul>
            <li>
              <strong>Q: How do I add new products to the inventory?</strong>
              <p>
                A: To add new products, navigate to the "Products" section in
                the admin dashboard and click on "Add New Product". Fill in the
                required details and save.
              </p>
            </li>
            <li>
              <strong>Q: How can I manage user accounts?</strong>
              <p>
                A: You can manage user accounts by going to the "Users" section
                in the admin dashboard. Here, you can view, edit, or delete user
                accounts as needed.
              </p>
            </li>
            <li>
              <strong>
                Q: What should I do if I encounter a technical issue?
              </strong>
              <p>
                A: If you encounter a technical issue, please contact the IT
                support team through the "Support" section in the admin
                dashboard or via the provided support email.
              </p>
            </li>
            <li>
              <strong>Q: How do I generate sales reports?</strong>
              <p>
                A: To generate sales reports, go to the "Reports" section in the
                admin dashboard. Select the desired date range and report type,
                then click "Generate Report".
              </p>
            </li>
            <li>
              <strong>Q: Can I customize the website layout?</strong>
              <p>
                A: Yes, you can customize the website layout by accessing the
                "Design" section in the admin dashboard. Here, you can modify
                themes, layouts, and other design elements.
              </p>
            </li>
            <li>
              <strong>Q: How do I update the application settings?</strong>
              <p>
                A: To update application settings, navigate to the "Settings"
                section in the admin dashboard. Make the necessary changes and
                save them.
              </p>
            </li>
          </ul>
        </AccordionTab>
        <AccordionTab
          header={
            <span className="flex align-items-center gap-2 w-full">
              <span className="font-bold white-space-nowrap">Merchant</span>
              <Badge value="6" className="ml-auto" />
            </span>
          }
        >
          <ul>
            <li>
              <strong>Q: How do I register as a merchant?</strong>
              <p>
                A: To register as a merchant, click on the "Merchant Sign Up"
                button on the homepage and fill in the required details. Once
                approved, you can start listing your products.
              </p>
            </li>
            <li>
              <strong>Q: How can I list my products?</strong>
              <p>
                A: After logging into your merchant account, go to the
                "Products" section and click on "Add New Product". Enter the
                product details, upload images, and save.
              </p>
            </li>
            <li>
              <strong>Q: How do I manage my orders?</strong>
              <p>
                A: You can manage your orders by navigating to the "Orders"
                section in your merchant dashboard. Here, you can view, process,
                and update the status of your orders.
              </p>
            </li>
            <li>
              <strong>Q: What are the fees for selling on the platform?</strong>
              <p>
                A: The platform charges a commission fee on each sale. For
                detailed information on fees, please refer to the "Fees and
                Payments" section in your merchant dashboard.
              </p>
            </li>
            <li>
              <strong>Q: How do I handle returns and refunds?</strong>
              <p>
                A: Returns and refunds can be managed through the "Returns"
                section in your merchant dashboard. Follow the provided
                guidelines to process returns and issue refunds.
              </p>
            </li>
            <li>
              <strong>Q: How can I contact merchant support?</strong>
              <p>
                A: For any assistance, you can contact merchant support via the
                "Support" section in your dashboard or by emailing our support
                team directly.
              </p>
            </li>
          </ul>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default page;
