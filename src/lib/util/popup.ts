import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';

export function svgTooltip(node: SVGElement, params: any) {
	const tooltip = document.getElementById(params.target);
	if (tooltip == null) throw Error(`Tooltip element with id ${params.target} not found.`);
	const middleware = [flip(), shift()];
	if (params.offset) middleware.push(offset(params.offset));
	let autoUpdateCleanup = () => {};
	function renderTooltip() {
		if (tooltip == null) throw Error(`Tooltip element with id ${params.target} lost.`);
		computePosition(node, tooltip, {
			placement: params.placement ?? 'top',
			middleware
		}).then(({ x, y }) => {
			Object.assign(tooltip.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}
	function open() {
		if (tooltip == null) throw Error(`Tooltip element with id ${params.target} lost.`);
		renderTooltip();
		Object.assign(tooltip.style, {
			display: 'block',
			opacity: 1,
			pointerEvents: 'auto',
			transition: 'opacity 100ms ease-in-out'
		});
		autoUpdateCleanup = autoUpdate(node, tooltip, renderTooltip, { elementResize: true });
	}
	function close() {
		if (tooltip == null) throw Error(`Tooltip element with id ${params.target} lost.`);
		Object.assign(tooltip.style, {
			display: 'block',
			opacity: 0,
			pointerEvents: 'auto'
		});
		autoUpdateCleanup();
	}
	node.addEventListener('mouseover', open, true);
	node.addEventListener('mouseleave', close, true);
	renderTooltip();
	return {
		update(params) {},
		destroy() {
			node.removeEventListener('mouseover', open, true);
			node.removeEventListener('mouseleave', close, true);
		}
	};
}
