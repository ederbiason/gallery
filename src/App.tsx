import { useState, useEffect } from 'react';
import { Container, Area, Header, ScreenWaring, PhotoList } from './App.styles';
import { PhotoItem } from './components/PhotoItem';
import { getAll } from './services/photos';
import { Photo } from './types/Photo';

export function App() {
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    const getPhotos = async () => {
      setLoading(true)

      setPhotos(await getAll())

      setLoading(false)
    }

    getPhotos()
  }, [])

  return (
    <Container>
      <Area>
        <Header>Galeria de Fotos</Header>

        {loading && 
          <ScreenWaring>
            <div className="emoji">✋</div>
            <div>Carregando...</div>
          </ScreenWaring>
        }

        {!loading && photos.length > 0 &&
          <PhotoList>
            {photos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name} />
            ))}
          </PhotoList>
        }

        {!loading && photos.length === 0 &&
          <ScreenWaring>
          <div className="emoji">😔</div>
          <div>Não há fotos cadastradas.</div>
        </ScreenWaring>
        }
      </Area>
    </Container>
  );
}