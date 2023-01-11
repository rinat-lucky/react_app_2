import React from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends React.Component {
	state = {
		charList: [],
		loading: true,
		error: false,
	}
	
	marvelService = new MarvelService();

	componentDidMount() {
		this.marvelService.getAllCharacters()
			.then(this.onCharListLoaded)
			.catch(this.onError)
	}

	onCharListLoaded = (charList) => {
		this.setState({
			charList,
			loading: false,
		})
	}

	onError = () => {
		this.setState({
			error: true,
			loading: false,
		})
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
		const { charList, loading, error } = this.state;
		const items = this.renderItems(charList);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button className="button button__main button__long">
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

export default CharList;
