/**
 * apis.js Created by sandy on 1/31/2020
 */
// POST
async function createBook() {
    const request = await Fetch.create('/books', {
        title: 'Code and Other Laws of Cyberspace',
        author: 'Lawrence Lessig'
    });
}

// PUT
async function updateBook(bookId) {
    const request = await Fetch.update('/books/' + bookId, {
        title: 'How to Live on Mars',
        author: 'Elon Musk'
    });
}

// DELETE
async function removeBook(bookId) {
    const request = await Fetch.remove('/books/' + bookId);
}
