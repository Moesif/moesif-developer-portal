export default function MoesifEmbeddedTemplate(props) {
  const { embedTemplateUrls } = props;

  return (
    <div className="dashboards page-layout__focus">
      <div className="dashboards-container">
        {embedTemplateUrls?.map((url, index) => (
          <iframe
            key={url}
            title={`Usage dashboard ${index + 1}`}
            id={url}
            src={url}
            name="preview-frame"
          />
        ))}
      </div>
    </div>
  );
}
