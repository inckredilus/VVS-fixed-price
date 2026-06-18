import type { CustomerDetails } from "../../types/services";

type Props = {
  customerDetails: CustomerDetails;
  onChange: (details: CustomerDetails) => void;
  onBack: () => void;
  onSubmit: () => void;
};

export default function CustomerDetailsForm({
  customerDetails,
  onChange,
  onBack,
  onSubmit,
}: Props) {
  function updateField(field: keyof CustomerDetails, value: string) {
    onChange({
      ...customerDetails,
      [field]: value,
    });
  }

  return (
    <main>
      <h1>Kunduppgifter</h1>

      <label>
        Förnamn
        <input
          type="text"
          value={customerDetails.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
        />
      </label>

      <label>
        Efternamn
        <input
          type="text"
          value={customerDetails.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
        />
      </label>

      <label>
        Adress
        <input
          type="text"
          value={customerDetails.address}
          onChange={(event) => updateField("address", event.target.value)}
        />
      </label>

      <label>
        Postnummer
        <input
          type="text"
          value={customerDetails.postalCode}
          onChange={(event) => updateField("postalCode", event.target.value)}
        />
      </label>

      <label>
        Ort
        <input
          type="text"
          value={customerDetails.city}
          onChange={(event) => updateField("city", event.target.value)}
        />
      </label>

      <label>
        Telefon
        <input
          type="tel"
          value={customerDetails.phone}
          onChange={(event) => updateField("phone", event.target.value)}
        />
      </label>

      <label>
        E-post
        <input
          type="email"
          value={customerDetails.email}
          onChange={(event) => updateField("email", event.target.value)}
        />
      </label>

      <label>
        Kommentar
        <textarea
          value={customerDetails.comment}
          onChange={(event) => updateField("comment", event.target.value)}
        />
      </label>

      <div>
        <button onClick={onBack}>Tillbaka</button>
        <button onClick={onSubmit}>Skicka beställning</button>
      </div>
    </main>
  );
}