const fs = require('fs')
const A11yDialog = require('../')

const IS_DIALOG_SUPPORTED = 'show' in document.createElement('dialog')

describe('When instantiated, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/constructor.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)

  it('should save reference to the dialog container', () => {
    expect(instance.container).toEqual(container)
  })

  it('should save reference to the dialog element', () => {
    expect(instance.dialog).toEqual(container.querySelector('dialog'))
  })

  it('should prepare to store registered event callbacks', () => {
    expect(instance._listeners).toEqual({})
  })
})

describe('When shown, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/base.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)
  const title = container.querySelector('.dialog-title')

  const onShow = jest.fn()
  instance.on('show', onShow)
  const returnedValue = instance.show()

  it('should set the `shown` property to `true`', () => {
    expect(instance.shown).toEqual(true)
  })

  it('should remove `aria-hidden` attribute from container element', () => {
    expect(container.getAttribute('aria-hidden')).toEqual(null)
  })

  it('should set `aria-hidden` to `true` to targets element', () => {
    expect(main.getAttribute('aria-hidden')).toEqual(
      IS_DIALOG_SUPPORTED ? null : 'true'
    )
  })

  it.skip('should set focus to first focusable element of dialog', () => {
    expect(document.activeElement).toEqual(title)
  })

  it.skip('should prevent the focus from being lost', () => {
    document.body.focus()
    expect(document.activeElement).toEqual(title)
  })

  it('should call registered `show` event callbacks', () => {
    expect(onShow).toHaveBeenCalled()
  })

  it('should return the dialog instance', () => {
    expect(A11yDialog.prototype.isPrototypeOf(returnedValue)).toEqual(true)
  })
})

describe('When hidden, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/base.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)
  const title = container.querySelector('.dialog-title')
  const previous = document.querySelector('.previous')
  const onHide = jest.fn()
  instance.on('hide', onHide)
  const returnedValue = instance.show().hide()

  it('should set the `shown` property to `false`', () => {
    expect(instance.shown).toEqual(false)
  })

  it('should set `aria-hidden` attribute to `true` to the container element', () => {
    expect(container.getAttribute('aria-hidden')).toEqual(
      IS_DIALOG_SUPPORTED ? null : 'true'
    )
  })

  it('should remove `aria-hidden` attribute from the main element', () => {
    expect(main.getAttribute('aria-hidden')).toEqual(null)
  })

  it.skip('should restore focus to previously focused element', () => {
    expect(document.activeElement).toEqual(previous)
  })

  it('should stop preventing the focus from being lost', () => {
    document.body.focus()
    expect(document.activeElement).toEqual(document.body)
  })

  it('should call registered `hide` event callbacks', () => {
    expect(onHide).toHaveBeenCalled()
  })

  it('should return the dialog instance', () => {
    expect(A11yDialog.prototype.isPrototypeOf(returnedValue)).toEqual(true)
  })
})

describe('When destroyed, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/controls.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)
  const title = container.querySelector('.dialog-title')
  const previous = document.querySelector('.previous')
  const opener = document.querySelector('[data-a11y-dialog-show="dialog"]')
  const closer = document.querySelector('[data-a11y-dialog-hide]')

  const onDestroy = jest.fn()
  instance.on('destroy', onDestroy)
  const returnedValue = instance.show().destroy()

  it('should hide the dialog', () => {
    expect(instance.shown).toEqual(false)
  })

  it('should remove click listener from openers', () => {
    opener.click()
    expect(instance.shown).toEqual(false)
  })

  it('should remove click listener from closers', () => {
    closer.click()
    expect(instance.shown).toEqual(false)
  })

  it('should call registered `destroy` event callbacks', () => {
    expect(onDestroy).toHaveBeenCalled()
  })

  it('should return the dialog instance', () => {
    expect(A11yDialog.prototype.isPrototypeOf(returnedValue)).toEqual(true)
  })

  it('should remove all registered listeners', () => {
    expect(instance._listeners).toEqual({})
  })
})

describe('When created, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/controls.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)
  const title = container.querySelector('.dialog-title')
  const previous = document.querySelector('.previous')
  const opener = document.querySelector('[data-a11y-dialog-show="dialog"]')
  const closer = document.querySelector('[data-a11y-dialog-hide]')

  const onCreate = jest.fn()
  instance.on('create', onCreate)
  const returnedValue = instance.create()

  it('should collect the targets', () => {
    expect(instance._targets).toEqual([main])
  })

  // @TODO: clarify
  it('should set the `shown` property to `false`', () => {
    expect(instance.shown).toEqual(false)
  })

  it('should set `data-a11y-dialog-native` to dialog element if supported', () => {
    expect(container.hasAttribute('data-a11y-dialog-native'))
      .toEqual(IS_DIALOG_SUPPORTED)
  })

  it('should set `aria-hidden` to `true` to dialog element if <dialog> not supported', () => {
    expect(container.getAttribute('aria-hidden')).toEqual(
      IS_DIALOG_SUPPORTED ? null : 'true'
    )
  })

  it('should add click listener to openers', () => {
    opener.click()
    expect(instance.shown).toEqual(true)
  })

  it('should add click listener to closers', () => {
    closer.click()
    expect(instance.shown).toEqual(false)
  })

  it('should call registered `create` event callbacks', () => {
    expect(onCreate).toHaveBeenCalled()
  })

  it('should return the dialog instance', () => {
    expect(A11yDialog.prototype.isPrototypeOf(returnedValue)).toEqual(true)
  })
})

describe('When listening to events, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/constructor.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)

  const noop = () => {}

  it('should properly register event listener', () => {
    instance.on('show', noop)
    expect(instance._listeners.show[0]).toEqual(noop)
  })

  it('should properly unregister event listener', () => {
    instance.off('show', noop)
    expect(instance._listeners.show.length).toEqual(0)
  })

  it('should silently fail to unregister an unknown event listener', () => {
    instance.off('show', 'foobar')
    expect(instance._listeners.show.length).toEqual(0)
  })
})

describe('When firing events, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/constructor.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)

  it('should pass dialog element as first argument', done => {
    instance.on('show', dialogEl => {
      expect(dialogEl).toEqual(container)
      done()
    }).show().hide()
  })
})

describe('When listening to key presses, it…', () => {
  const html = fs.readFileSync('./tests/fixtures/controls.html', 'utf8')
  document.body.innerHTML = html

  const container = document.querySelector('.dialog-container')
  const main = document.querySelector('.main')
  const instance = new A11yDialog(container, main)

  it('should close dialog on ESC', () => {
    instance.show()
    keydown(27)
    expect(instance.shown).toEqual(false)
  })

  it.skip('should trap focus on TAB', () => {
    instance.show()
    keydown(9, true)
    expect(document.activeElement).toEqual(
      document.querySelector('.close-button')
    )
  })
})

function keydown (k, shift) {
  var oEvent = document.createEvent('KeyboardEvent');
  Object.defineProperty(oEvent, 'keyCode', { get: function() { return this.keyCodeVal; } });
  Object.defineProperty(oEvent, 'which', { get: function() { return this.keyCodeVal; } });

  if (oEvent.initKeyboardEvent) {
    oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, shift, false, shift, k);
  } else {
    oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, shift, false, k, 0);
  }

  oEvent.keyCodeVal = k;

  if (oEvent.keyCode !== k) {
    alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
  }

  document.dispatchEvent(oEvent);
}

function toArray (collection) {
  return Array.prototype.slice.call(collection);
}
