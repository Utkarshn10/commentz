## Commentz

Implementation of Inline commenting System for blogs. The Author will share the link to the article and commentators will be able to add inline comments to the blog.

### Storage and DB Design

LocalStorage is used for Demo Purposes. Data will be stored in the following manner:

```
{
[userID]: {
	[blogID]: {
		"comments": [
		{
			"commenatorID": "abcf324" //userID of the commenter
			"commentID": "ehvhvc",
			"blogText": "Through this creative process ....",
			"commentDesc": "Looks good !"
			"characterOffset": "1",
			"lineContentHash": "97d313def28a1effc148ce636ea3fcb0"
			"lineNumber": "8"
		}
		],
		"content": {
			"title": "Unleashing Creativity: The Art of Building Side Projects",
			"textcontent": "Embarking on the journey of building side projects is ....."
		},
		"version": 1
		}
	}
}
```

### Tech Stack

- Next.js
- Tailwind CSS
- DB: LocalStorage
- Host: Vercel
