export default function MoesifEmbeddedTemplate(props) {
  const { iFrameSrcLiveEvent, iFrameSrcTimeSeries, embedTemplateUrls } = props;

  return (
    <div className="dashboards page-layout__focus">
      <div className="dashboards-container">
        {iFrameSrcLiveEvent && (
          <iframe
            title="Moesif Live Event Log"
            id="preview-frame-event"
            src={props.iFrameSrcLiveEvent}
            name="preview-frame"
            noresize="noresize"
          />
        )}
        {iFrameSrcTimeSeries && (
          <iframe
            title="Moesif Time Series"
            id="preview-frame-time"
            src={props.iFrameSrcTimeSeries}
            name="preview-frame"
            noresize="noresize"
          />
        )}
        {embedTemplateUrls?.map((url, index) => (
          <iframe
            key={url}
            title={`Moesif Dash ${index}`}
            id={url}
            src={url}
            name="preview-frame"
            noresize="noresize"
          />
        ))}
      </div>
    </div>
  );
}
