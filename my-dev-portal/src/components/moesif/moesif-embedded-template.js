export default function MoesifEmbeddedTemplate(props) {
  return (
    <div className="dashboards page-layout__focus">
      <div className="dashboards-container">
        <iframe
          title="Moesif Live Event Log"
          id="preview-frame"
          src={props.iFrameSrcLiveEvent}
          name="preview-frame"
          noresize="noresize"
        ></iframe>

        <iframe
          title="Moesif Time Series"
          id="preview-frame"
          src={props.iFrameSrcTimeSeries}
          name="preview-frame"
          noresize="noresize"
        ></iframe>
      </div>
    </div>
  );
}
