export function createTippyInstance(display) {
    return tippy(display, {
      arrow: false,
      placement: 'left',
      animation: 'scale',
      interactive: false,
      delay: [0, 1]
    })
  }