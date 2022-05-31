import { useState, useEffect, FormEvent } from 'react';
import { Container, Area, Header, ScreenWaring, PhotoList, UploadForm, Input } from './App.styles';
import { PhotoItem } from './components/PhotoItem';
import { getAll, insert } from './services/photos';
import { Photo } from './types/Photo';

export function App() {
  const [uploading, setUploading] = useState(false)
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

  async function handleFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;

    if(file && file.size > 0) {
      setUploading(true)

      let result = await insert(file)

      setUploading(false)

      if (result instanceof Error) {
        alert(`${result.name} - ${result.message}`)
      } else {
        let newPhotoList = [...photos]

        newPhotoList.push(result)

        setPhotos(newPhotoList)
      }
    }
  }

  return (
    <Container>
      <Area>
        <Header>Galeria de Fotos</Header>

        <UploadForm method="POST" onSubmit={handleFormSubmit}>
          <Input type="file" name="image"/>
          <input type="submit" value="Upload" />
          {uploading && "📨 Enviando..."}
        </UploadForm>

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