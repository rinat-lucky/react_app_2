class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=f317952fca3b97be3dff2fda66eb4944';
  
  _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }
  
  getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    return await res.json();
  };

  getAllCharacters = async () => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter);
  }

  getSingleCharacter = async (id) => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  }
}

export default MarvelService;