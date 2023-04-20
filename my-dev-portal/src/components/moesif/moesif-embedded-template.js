export default function MoesifEmbeddedTemplate(props) {
  return (
    <>
      <div className="iframeWrapper">
        <iframe
          title="Moesif Live Event Log"
          id="preview-frame"
          src={props.iFrameSrcLiveEvent}
          name="preview-frame"
          noresize="noresize"
        ></iframe>
      </div>
      <div className="iframeWrapper">
        <iframe
          title="Moesif Time Series"
          id="preview-frame"
          src={props.iFrameSrcTimeSeries}
          name="preview-frame"
          noresize="noresize"
        ></iframe>
      </div>
      {props.error}
    </>
  );
}
