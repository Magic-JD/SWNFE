export function createTippyInstance(display) {
    return tippy(display, {
      delay: 0,
      html: true,
      placement:"left"
    })
  }