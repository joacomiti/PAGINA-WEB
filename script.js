let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const contadorCarrito = document.getElementById("cart-count");    //numero de productos en el carrito (el de al lado del icono)
        const listaCarrito = document.getElementById("cart-items");       //lista ul de productos 
        const totalCarrito = document.getElementById("cart-total");       //suma total de precio de los productos


        function actualizarContador() {      //actualiza el contador de productos en el carrito
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorCarrito.textContent = total;
        }

        function renderCarrito() {      //muestra los productos, total, botones de los productos de carrito
            listaCarrito.innerHTML = "";
            let total = 0;
            carrito.forEach((item, index) => {
                total += item.cantidad * item.precio;
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");   //puedo usar setAttribute pero es mejor practica classList.add
                li.innerHTML = `
                <div>
                    <img src="${item.img}" alt="${item.nombre}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">
                    <strong>${item.nombre}</strong> x ${item.cantidad}
                    <br><small>$${item.precio} c/u</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="cambiarCantidad(${index}, 1)">+</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(${index})">🗑️</button>
                </div>
                `;
                listaCarrito.appendChild(li);
            });

            totalCarrito.textContent = total;
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
            const btnIrAPagar = document.getElementById("btn-ir-a-pagar");
            if (carrito.length === 0) {
                btnIrAPagar.classList.add("disabled");
                btnIrAPagar.setAttribute("aria-disabled", "true");
                btnIrAPagar.removeAttribute("href");
            } else {
                btnIrAPagar.classList.remove("disabled");
                btnIrAPagar.setAttribute("aria-disabled", "false");
                btnIrAPagar.setAttribute("href", "checkout.html");
    }
        }

        function cambiarCantidad(index, cambio) {     //botones de + y - de cada producto, y si llega a 0 ejecutar eliminar 
            carrito[index].cantidad += cambio;
            if (carrito[index].cantidad <= 0) {
                eliminarDelCarrito(index);
            } else {
                renderCarrito();
            }
        }

        function eliminarDelCarrito(index) {     //boton de eliminar solo el producto del carrito
        carrito.splice(index, 1);
        renderCarrito();
        }

        function vaciarCarrito() {   //boton para eliminar todo el carrito
            if (carrito.length === 0) {
                alert("El carrito ya está vacío.");
                return;
            }
        carrito = [];
        renderCarrito();
        }

        function agregarAlCarrito(nombre,precio,img) {    //agrego producto al carrito, si ya existe aumenta 1 la cantidad
        const existente = carrito.find(item => item.nombre === nombre);
        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({ nombre, precio, cantidad: 1,img });
        }
        renderCarrito();
        const modal = new bootstrap.Modal(document.getElementById("cartModal"));
        modal.show();
        }


        //botones-eventos 
        const botonesAgregar=document.querySelectorAll(".add-to-cart");

        botonesAgregar.forEach(boton => {   //recorro todos los botones de agregar al carrito, extraigo los datos y con la funcion los agrego al carrito
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.product;
            const precio = parseFloat(boton.dataset.precio);
            const img = boton.dataset.img; // Si necesitas la imagen, puedes usarla aquí
            agregarAlCarrito(nombre,precio,img);
        });
        });

        document.getElementById("cart-btn").addEventListener("click", () => {
        const modal = new bootstrap.Modal(document.getElementById("cartModal"));
        modal.show();
        });

        // Cargar al iniciar
        renderCarrito();