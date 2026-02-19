import { useLayoutEffect, useRef, useState } from "react";
import type { IMapDistrict } from "..";

interface DistrictWithLabelProps {
	d: string;
	id: string;
	district?: IMapDistrict;
	fallbackDistrictName?: string;
}

const DistrictWithLabel = ({ d, district, id, fallbackDistrictName }: DistrictWithLabelProps) => {
	const pathRef = useRef<SVGPathElement>(null);
	const [center, setCenter] = useState<{ x: number; y: number } | null>(null);

	useLayoutEffect(() => {
		const path = pathRef.current;
		if (!path) return;
		const bbox = path.getBBox();
		setCenter({
			x: bbox.x + bbox.width / 2,
			y: bbox.y + bbox.height / 2,
		});
	}, [d]);

	return (
		<g>
			<path ref={pathRef} d={d} id={id} />
			{center && (
				<text
					x={center.x}
					y={center.y}
					textAnchor="middle"
					dominantBaseline="central"
					className="district-label"
				>
					{district?.name ?? fallbackDistrictName}
				</text>
			)}
		</g>
	);
}

export default DistrictWithLabel;