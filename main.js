xs.periodic(1000)
.fold(prev => prev + 1, 0)
.map(i => `second elapsed: ${i}`)
.subscribe({
  next: str => {
    const elem = document.querySelector('#app');
    elem.textContent = str;
  }
})
