import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends React.Component {
	state = {
		charList: [],
		loading: true,
		error: false,
		newItemLoading: false,
		offset: 210,
		charEnded: false,
	}
	
	marvelService = new MarvelService();

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({ offset, charList }) => ({
			charList: [...charList, ...newCharList],
			loading: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended,
		}))
	}

	onError = () => {
		this.setState({
			error: true,
			loading: false,
		})
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError);
	}

	componentDidMount() {
		this.onRequest();
	}

	renderItems(chars) {
		const items = chars.map((item) => {
			const { id, name, thumbnail } = item;
			let imgStyle = {'objectFit' : 'cover'};
			if (thumbnail.split('/').at(-1) === 'image_not_available.jpg') {
				imgStyle = { objectFit: 'unset' };
			}
			
			return (
				<li 
					className="char__item"
					key={id}
					onClick={() => this.props.onCharSelected(id)}
				>
						<img src={thumbnail} alt={name} style={imgStyle}/>
						<div className="char__name">{name}</div>
				</li>
			)
		});

		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}

	render() {
		const { charList, loading, error, newItemLoading, offset, charEnded } = this.state;
		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemLoading}
					onClick={() => this.onRequest(offset)}
					style={{'display': charEnded ? 'none' : 'block'}}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
}

export default CharList;
