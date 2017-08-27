import React from "react";
import Svg, { Path } from "react-native-svg";

const PlaceProd = props => (
<Svg width={props.width || 100} height={props.height || 125} viewBox="0 0 100 125"><Path style="text-indent:0;text-transform:none;block-progression:tb" d="M50.375 6.075l40 16c.37.15.63.539.625.938v54c-.008.388-.265.76-.625.906l-40 16a1.013 1.013 0 0 1-.75 0l-40-16A1.024 1.024 0 0 1 9 77.013v-54a1.026 1.026 0 0 1 .625-.938l40-16c.344-.134.588-.027.75 0zm-.375 2L12.687 23.013l14.125 5.625 35.22-15.75zm20.969 8.375L34.594 31.763 50 37.919l37.312-14.937zM89 24.482L51 39.669v51.844l38-15.188zm-78 0v51.843l38 15.188V39.669l-15-6v16.344l-8-3V30.482z" overflow="visible" fill="#EC5C00"></Path></Svg>
);

export default PlaceProd;
