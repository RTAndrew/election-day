import { Tooltip } from "antd";
import type React from "react";
import type { IMapDistrict } from "..";
import { SLUGIFIED_DISTRICT_NAMES } from "../utils";
import DistrictWithLabel from "./district-with-label";
import "./map.css";

interface LisbonJSXMapProps extends React.SVGProps<SVGSVGElement> {
	districts: IMapDistrict[];
}

export function LisbonJSXMap({ districts, ...props }: LisbonJSXMapProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="lisbon-map"
			version="1.2"
			baseProfile="tiny"
			width="800"
			height="616"
			viewBox="0 0 800 616"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<g id="lisbon-constituency-limit">
				{Object.keys(SLUGIFIED_DISTRICT_NAMES).map((key, idx) => {
					const foundDistrict = districts.find((item) => item.slug === key);

					return (
						<Tooltip
							className="tooltip"
							title={
								<div className="tooltip-content">
									<span className="tooltip-title">
										District: {foundDistrict?.name ?? SLUGIFIED_DISTRICT_NAMES[key].name}
									</span>
									{foundDistrict && <>
										<span className="tooltip-party">
											Party: {foundDistrict?.winningParty?.name}
										</span>
										<span className="tooltip-color">
											Votes:{" "}
											{Intl.NumberFormat("en-US").format(
												foundDistrict?.winningParty?.votes ?? 0,
											)}
										</span>
									</>}
								</div>
							}
						>
							<g
								className="district"
								id={`district-${key}`}
								data-name={key}
								// override the fill color from the CSS
								style={{
									fill: foundDistrict?.winningParty?.color ?? "#aeaeae",
								}}
							>
								<DistrictWithLabel
									d={SLUGIFIED_DISTRICT_NAMES[key].svgPath}
									id={idx.toString()}
									fallbackDistrictName={SLUGIFIED_DISTRICT_NAMES[key].name}
									district={foundDistrict}
								/>
							</g>
						</Tooltip>
					);
				})}
			</g>
		</svg>
	);
}
