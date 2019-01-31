##POST REQUEST
#POST Request - Product

#Request Format
```
{
	"name": "martin",
	"price": 100
}
```

#201 POST Request - Product - Success Response
```
{
    "message": "Created product successfully",
    "createdProduct": {
        "name": "martin",
        "price": 100,
        "_id": "5c5307c8973cb798be964b1b",
        "request": {
            "type": "GET",
            "url": "http://localhost:5000/products/5c5307c8973cb798be964b1b"
        }
    }
}
```

#500 Error from POST request - error in code

```
{
    "error": {}
}
```

