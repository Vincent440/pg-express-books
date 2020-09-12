INSERT INTO public.books(
	title, authors, description, categories, publisher, preview_link, created_at, query_string, published_date, id)
	VALUES ( 'Example book title', '{"Author One","Author Two"}',
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero unde vel laboriosam autem mollitia soluta laudantium minus hic cum,...',
			'{"Science","Other Category"}', 'Publisher Name',
			'http://books.google.com/books?id=DjjWea3fgO8C&printsec=frontcover&dq=carlsagan&hl=&cd=10&source=gbs_api',
			'2019-11-27 11:23:43.200608-05',
			'test',
			'2011-07-06',
			1);
