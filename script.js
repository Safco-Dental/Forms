const submitData = async(data) => {
    try{
        const response = await fetch('https://api.safcodental.com/forms-submission/submit-issue', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: data
        }).catch(error => {throw new Error('Error Creating the Issue')});

        if (response.ok) {
            document.getElementById('response').innerHTML = 'Issue created successfully!';
            document.getElementById('response').classList.remove('alert-danger')
            document.getElementById('response').classList.add('alert-success')
            form.reset();
        } else {
            document.getElementById('response').innerHTML = 'Failed to create issue.';
            document.getElementById('response').classList.remove('alert-success')
            document.getElementById('response').classList.add('alert-danger')
        }
    }catch(error){
        document.getElementById('response').innerHTML = 'Failed to create issue.';
        document.getElementById('response').classList.remove('alert-success')
        document.getElementById('response').classList.add('alert-danger')
    }

}