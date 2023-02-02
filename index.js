function handleRedirect(event) {
    let name = event.target.id.replace("-button", "")
    window.location.replace(name + "/" + name + ".html");
}

document.querySelectorAll('button').forEach(button => { button.addEventListener('click', handleRedirect) });
