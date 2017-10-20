import swal from 'sweetalert2'
import axios from 'axios'

// Delete Profile
export function deleteProfile() {
	swal({
		title: 'Are you sure?',
		text: 'You are about to permanently delete your profile.',
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#d33',
		confirmButtonText: 'Continue'
	}).then(() => {
		this.setState({ loading: true })
		axios.delete('/api/me', { headers: { 'Authorization': localStorage.getItem('token') } }).then(() => {
			this.logout()
		}).catch(() => {
			this.setState({ loading: false })
			swal(
				'Uh Oh!',
				'Something went wrong. Please try again later.',
				'error'
			)
		})
	}).catch(() => {})
}

// Get Profile
export function getProfile() {
	this.setState({ loading: true })
	axios.get('/api/me', { headers: { 'Authorization': localStorage.getItem('token') } }).then(({ data }) => {
		this.setState({ loading: false })
		if (data.error) {
			swal(
				'Uh Oh!',
				data.error,
				'error'
			)
		} else if (data.invalidLogin) {
			localStorage.removeItem('token')
			this.props.history.push('/')
		} else {
			this.setState({
				name: data.name || '',
				email: data.email || '',
				googleId: data.google_id || '',
				facebookId: data.facebook_id || ''
			})
		}
	}).catch(() => {
		this.setState({ loading: false })
		swal(
			'Uh Oh!',
			'Something went wrong. Please try again later.',
			'error'
		)
	})
}
