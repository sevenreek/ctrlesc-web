import type { components } from './api/types';

export type DigitalStateComponent = components['schemas']['DigitalStateComponent'];
export type SequenceComponent = components['schemas']['SequenceComponent'];
export type SpeechDetectionComponent = components['schemas']['SpeechDetectionComponent'];
export type UIComponentType = components['schemas']['UIComponentType'];
export type ComponentState = Record<string, any> | null | undefined;

export function inferComponentType(component: { type: UIComponentType }) {
	switch (component.type) {
		case 'digitalState':
			return component as DigitalStateComponent;
		case 'sequence':
			return component as SequenceComponent;
		case 'speechDetection':
			return component as SpeechDetectionComponent;
	}
}
