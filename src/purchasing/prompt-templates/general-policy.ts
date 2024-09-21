import { Organization, User } from "src/db/schemas";
import { PurchaseOrder } from "src/db/schemas/PurchaseOrder";

type PromptTemplate =  {
    organization: Organization,
    user: User
}

// **Finance and Compliance Procurement Policy**

// **1. Purpose**
// This section of the procurement policy aims to ensure that all purchases are financially responsible, comply with company budget guidelines, and adhere to applicable laws and regulations. It outlines how financial controls are implemented, how compliance is maintained, and how financial risks are mitigated during the procurement process.

// **2. Scope**
// This policy applies to all departments and employees responsible for making purchases and financial decisions on behalf of the company. It governs all procurement activities, including vendor selection, budget approval, contract management, and compliance with legal and regulatory requirements.

// **3. Financial Controls**

// **3.1. Budget Alignment**
// All procurement activities must align with the department’s approved budget. Any request that exceeds the allocated budget must be flagged and sent to the Finance Department for review. Over-budget purchases may only proceed after approval from the Department Head and the CFO.

// **3.2. Purchase Approval Limits**
// To ensure financial accountability, approval authority is assigned based on the value of the purchase:

// - **Small Purchases (< $1,000):** Approved by the Department Head.
// - **Moderate Purchases ($1,000 - $10,000):** Require approval from both the Department Head and the Procurement Officer.
// - **Large Purchases ($10,000 - $50,000):** Require approval from the Department Head, Procurement Officer, and Finance Department.
// - **Major Purchases (>$50,000):** Require Executive Leadership approval, including review by the CFO or CEO.

// All purchase approvals must be documented in the procurement system, and any deviations from standard approval thresholds must be reported to the CFO.

// **3.3. Payment Terms and Conditions**
// All vendor contracts must clearly outline payment terms, including:

// - Net payment terms (e.g., Net 30, Net 60).
// - Late fees or penalties for overdue payments.
// - Conditions for early payment discounts (if applicable).
// - Any financing terms related to long-term purchases.

// The Finance Department is responsible for ensuring that these payment terms are adhered to and that all payments are processed promptly to maintain the company's financial standing.

// **3.4. Payment Authorization**
// All payments must be authorized by the Finance Department before funds are released to vendors. The following payment steps must be followed:

// - Verification that the goods or services were received and meet contractual terms.
// - Comparison of the vendor’s invoice with the original purchase order.
// - Verification of the correct amount, tax calculations, and applicable discounts.

// For high-value purchases, a second authorization from the CFO or a designated executive is required before payment is issued.

// ##### **3.5. Financial Reporting**
// The Finance Department will generate monthly and quarterly reports summarizing procurement activities, including:

// - Total spending by department and category.
// - Budget variances.
// - Supplier performance and cost savings.
// - Compliance with internal financial controls.

// These reports must be reviewed by the Executive Leadership team to assess the financial health and efficiency of procurement operations.

// #### **4. Compliance Policies**

// ##### **4.1. Legal and Regulatory Compliance**
// All procurement activities must comply with applicable federal, state, and local regulations, including:

// - **Tax Compliance:** Ensure that all applicable sales taxes, VAT, and other required taxes are properly calculated and recorded.
// - **Anti-Corruption Laws:** The company will comply with the Foreign Corrupt Practices Act (FCPA) and any local anti-bribery laws. Employees and agents must not engage in any form of bribery or unethical conduct.
// - **Trade Compliance:** For international purchases, ensure that vendors comply with import/export regulations, tariffs, and embargo restrictions. Obtain necessary licenses and documentation.

// ##### **4.2. Ethical Vendor Selection**
// Vendor selection must be based on objective financial and performance criteria, and employees must avoid conflicts of interest. Vendors must:

// - Provide certifications that they comply with labor laws, environmental regulations, and ethical sourcing standards.
// - Be vetted for financial stability and compliance with relevant laws.
// - Be evaluated regularly for compliance with contractual obligations.

// All employees involved in procurement are required to disclose any potential conflicts of interest, and failure to do so will result in disciplinary action.

// ##### **4.3. Audit and Recordkeeping**
// All procurement records, including purchase orders, contracts, invoices, and payment authorizations, must be maintained for a minimum of five years. The Finance Department will conduct regular internal audits to ensure compliance with:

// - Approval thresholds.
// - Vendor contract terms.
// - Payment processing accuracy.
// - Budget adherence.

// In the case of non-compliance, the CFO will lead an investigation and report findings to the Executive Leadership team for corrective action.

// **4.4. Supplier Risk Management**
// The company must regularly assess the financial and operational risks associated with its suppliers. High-risk suppliers—such as those located in politically unstable regions or those with histories of non-compliance—must undergo additional scrutiny, including:

// - Detailed financial audits.
// - Review of risk mitigation strategies (e.g., backup suppliers).
// - Increased frequency of compliance reviews.

// The Procurement and Finance teams are jointly responsible for developing contingency plans for critical suppliers to mitigate supply chain disruptions.

// **5. Financial Risk Mitigation**

// **5.1. Spend Limits and Tracking**
// - Each department will have clearly defined spend limits, monitored by the Finance Department.
// - Spend tracking software will be integrated into the procurement system to ensure real-time tracking of all expenses against departmental budgets.
// - High-risk purchases, such as those involving volatile commodities or long-term commitments, must be pre-approved by the Finance Department.

// **5.2. Fraud Prevention**
// - All employees must adhere to internal controls to prevent procurement fraud, including segregation of duties in the procurement process (e.g., one employee issues POs, while another approves payments).
// - Any suspected cases of fraud or misappropriation must be immediately reported to the Compliance Officer or CFO for investigation.

// **6. Review and Amendments**
// This finance and compliance policy will be reviewed annually by the CFO and the Executive Leadership team to ensure its effectiveness and alignment with changing financial regulations and company goals. Amendments to the policy must be approved by the CFO and CEO.

// ---

// This policy ensures strict financial oversight, risk mitigation, and compliance with legal and ethical standards, providing a solid framework for managing procurement activities responsibly.


const GeneralPolicyPrompt = (po: PurchaseOrder) => {
    return 
    `
    You are to analyze and validate the purchase order againts the policies above. 




    `;
}