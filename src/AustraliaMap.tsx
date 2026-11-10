export function AustraliaMap() {
  return <div className="operations-map" role="group" aria-label="Phoenix operation locations in Australia">
    <img src="/assets/australia-relief-cutout.svg" alt="" width="650" height="400" loading="lazy" />
    <svg viewBox="0 0 650 400" aria-hidden="true" focusable="false">
      <path className="operations-network-route" d="M466 264 Q452 293 401 305" />
      <g className="operations-marker">
        <circle className="operations-pin-ring" cx="466" cy="264" r="8" />
        <circle className="operations-pin" cx="466" cy="264" r="3.2" />
        <path className="operations-leader" d="M474 264h17" />
        <text className="operations-city" x="497" y="268">Sydney</text>
      </g>
      <g className="operations-marker">
        <circle className="operations-pin-ring" cx="401" cy="305" r="8" />
        <circle className="operations-pin" cx="401" cy="305" r="3.2" />
        <path className="operations-leader" d="M408 311l17 16h7" />
        <text className="operations-city" x="435" y="334">Melbourne</text>
      </g>
    </svg>
  </div>;
}
