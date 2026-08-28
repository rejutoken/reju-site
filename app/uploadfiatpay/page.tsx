import SimpleUploadPage from "../components/SimpleUploadPage";

export default function Page() {
  return (
    <SimpleUploadPage
      title="Fiat Payment Receipt"
      type="fiatpay"
      description="Upload your fiat payment confirmation or receipt."
    />
  );
}