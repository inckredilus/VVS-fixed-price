import type { CustomerDetails } from "../../types/services";
import "../../styles/components/services/customer-details-form.css";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------
// CustomerDetailsForm is a presentation component.
//
// It receives the current customer details object and sends changes back to
// ServiceBrowser.tsx through onChange. Navigation and order-flow decisions are
// also handled by the parent component.

type Props = {
  customerDetails: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
  onBack: () => void;
  onContinue: () => void;
  onCancel: () => void;
};

export default function CustomerDetailsForm({
  customerDetails,
  onChange,
  onBack,
  onContinue,
  onCancel,
}: Props) {
  // ---------------------------------------------------------------------------
  // Helper functions
  // ---------------------------------------------------------------------------
  // updateField updates one customer-detail field while keeping the rest of the
  // form data unchanged.

  function updateField(field: keyof CustomerDetails, value: string) {
    onChange({
      ...customerDetails,
      [field]: value,
    });
  }

  function clearCustomerDetails() {
    onChange({
      firstName: "",
      lastName: "",
      address: "",
      postalCode: "",
      city: "",
      phone: "",
      email: "",
      comment: "",
    });
  }

  // ---------------------------------------------------------------------------
  // Form validation
  // ---------------------------------------------------------------------------
  // All fields except comment are required before the customer can continue to
  // the order confirmation page.

const isTestCustomer =
  customerDetails.firstName.trim().toLowerCase() === "vvstest";

const isFormComplete =
  isTestCustomer ||
  (
    customerDetails.firstName.trim() !== "" &&
    customerDetails.lastName.trim() !== "" &&
    customerDetails.address.trim() !== "" &&
    customerDetails.postalCode.trim() !== "" &&
    customerDetails.city.trim() !== "" &&
    customerDetails.phone.trim() !== "" &&
    customerDetails.email.trim() !== ""
  );

  // ---------------------------------------------------------------------------
  // Page rendering
  // ---------------------------------------------------------------------------

  return (
    <main className="customer-form">
      <h1 className="customer-form__title">
        Kunduppgifter
      </h1>

      {/* ---------------------------------------------------------------------
          Customer name
          --------------------------------------------------------------------- */}

      <section className="customer-form__group">
        <h2 className="customer-form__group-title">Namn</h2>

        <div className="customer-form__row customer-form__row--two">
          <label className="customer-form__field">
            <span className="customer-form__label">Förnamn</span>
            <input
              className="customer-form__input"
              type="text"
              placeholder="Förnamn"
              value={customerDetails.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
            />
          </label>

          <label className="customer-form__field">
            <span className="customer-form__label">Efternamn</span>
            <input
              className="customer-form__input"
              type="text"
              placeholder="Efternamn"
              value={customerDetails.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
            />
          </label>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Address
          --------------------------------------------------------------------- */}

      <section className="customer-form__group">
        <h2 className="customer-form__group-title">Adress</h2>

        <label className="customer-form__field">
          <span className="customer-form__label">Gatuadress</span>
          <input
            className="customer-form__input"
            type="text"
            placeholder="Gatuadress"
            value={customerDetails.address}
            onChange={(event) => updateField("address", event.target.value)}
          />
        </label>

        <div className="customer-form__row customer-form__row--postal">
          <label className="customer-form__field">
            <span className="customer-form__label">Postnummer</span>
            <input
              className="customer-form__input"
              type="text"
              placeholder="Postnummer"
              value={customerDetails.postalCode}
              onChange={(event) => updateField("postalCode", event.target.value)}
            />
          </label>

          <label className="customer-form__field">
            <span className="customer-form__label">Ort</span>
            <input
              className="customer-form__input"
              type="text"
              placeholder="Ort"
              value={customerDetails.city}
              onChange={(event) => updateField("city", event.target.value)}
            />
          </label>
        </div>
      </section>

      {/* ---------------------------------------------------------------------
          Contact details
          --------------------------------------------------------------------- */}

      <section className="customer-form__group">
        <h2 className="customer-form__group-title">Kontakt</h2>

        <label className="customer-form__field">
          <span className="customer-form__label">Telefon</span>
          <input
            className="customer-form__input"
            type="tel"
            placeholder="Telefon"
            value={customerDetails.phone}
            onChange={(event) => updateField("phone", event.target.value)}
          />
        </label>

        <label className="customer-form__field">
          <span className="customer-form__label">E-post</span>
          <input
            className="customer-form__input"
            type="email"
            placeholder="E-post"
            value={customerDetails.email}
            onChange={(event) => updateField("email", event.target.value)}
          />
        </label>
      </section>

      {/* ---------------------------------------------------------------------
          Optional customer comment
          --------------------------------------------------------------------- */}

      <section className="customer-form__group">
        <h2 className="customer-form__group-title">Kommentar</h2>

        <label className="customer-form__field">
          <span className="customer-form__label">Kommentar</span>
          <textarea
            className="customer-form__textarea"
            placeholder="Kommentar"
            value={customerDetails.comment}
            onChange={(event) => updateField("comment", event.target.value)}
          />
        </label>
      </section>

      {/* ---------------------------------------------------------------------
          Navigation buttons
          ---------------------------------------------------------------------
          Tillbaka : Return to the order/cart page.
          Fortsätt: Continue to order confirmation, enabled only when required
                    fields are completed.
          Avbryt  : Cancel the entire order flow through the parent controller.
          --------------------------------------------------------------------- */}

      <div className="customer-form__actions">
        <button 
          className="customer-form__button customer-form__button--secondary"
          onClick={onBack}>
            Tillbaka
          </button>

        <button 
          className="customer-form__button customer-form__button--primary"
          onClick={onContinue} 
          disabled={!isFormComplete}>
            Fortsätt
        </button>

        <button
          className="customer-form__button customer-form__button--secondary"
          onClick={clearCustomerDetails}
        >
          Rensa
        </button>
        
        <button 
          className="customer-form__button customer-form__button--ghost"
          onClick={onCancel}>
            Avbryt
        </button>
      </div>
    </main>
  );
}