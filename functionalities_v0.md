## Watch It Together – V0

### Main Page
- Header displaying the total number of watched movies
- List of movies marked as watched
  - Displays movie poster, title, and average rating from participants
  - When clicking on a list item, the review details are displayed
- Button to add a movie as watched

### Add Watched Movie
- Input with select to search and filter movies
  - Input requires at least 2 characters
  - Back button in the top-left corner returns to the main page
  - API requests are made using debounce based on user input
  - When a movie is selected, its details (poster, title, and release year) are displayed after filtering
  - Button to add the movie as watched and proceed to the review

### Add Review
- Displays movie details
- Back button
  - Returns to the add movie screen
  - Marks the movie as not watched (confirmation modal required)
- Displays 5 star-shaped buttons at the bottom for rating
  - Half-star selection is supported (0.5 increments)
- Button to submit the rating at the bottom of the screen

### Review Details
- Displays movie details
- Displays voting details from each user

---

## Português

## Watch It Together – V0

### Página Principal
- Cabeçalho exibindo a quantidade de filmes assistidos
- Lista de filmes marcados como assistidos
  - Exibe capa, nome e pontuação média dos participantes
  - Ao clicar em um item da lista, exibe os detalhes do review
- Botão para adicionar filme como assistido

### Adição de Filme Assistido
- Input com select para buscar e filtrar filmes
  - O input precisa de no mínimo 2 caracteres
  - Botão de voltar no canto superior esquerdo retorna para a tela principal
  - As consultas são feitas com debounce baseado na interação com o input
  - Quando um filme é selecionado, exibe seus detalhes (cartaz, nome e ano de lançamento)
  - Botão para adicionar o filme como assistido e seguir para o review

### Adição de Review
- Exibe os detalhes do filme
- Botão de voltar
  - Retorna para a tela de adição de filme
  - Marca o filme como não assistido (modal de confirmação)
- Exibição de 5 botões em formato de estrela na parte inferior para avaliação
  - É possível selecionar meia estrela (incrementos de 0.5)
- Botão para enviar a avaliação na parte inferior da tela

### Detalhes do Review
- Exibe os detalhes do filme
- Exibe os detalhes da votação de cada usuário
