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
			"commenterID": "abcf324" //userID of the commenter
			"commentID": "ehvhvc",
			"blogText": "Through this creative process, individuals not only hone their technical skills but also cultivate a mindset that embraces curiosity and continuous learning.",
			"commentDesc": "Looks good !"
		}
		],
		"content": {
			"heading": "Unleashing Creativity: The Art of Building Side Projects",
			"textcontent": "Embarking on the journey of building side projects is akin to opening the floodgates of creativity. These endeavors serve as a canvas for self-expression, allowing individuals to unleash their imagination and bring ideas to life."
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
