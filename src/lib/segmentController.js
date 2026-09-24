function goToNextPhase(currentSegment) {
    if (currentSegment === 'focus') return 'break';
    if (currentSegment === 'break') return 'focus';
    throw Error('Unknown segment type');
}

function endSession() {}

export { goToNextPhase, endSession };
