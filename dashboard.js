document.addEventListener('DOMContentLoaded',()=>{
  const tabla= document.getElementById('productos').querySelector('tbody');

  let getProducts = [];

  function getProducts(){
      fetch('http://localhost/productos/getproductos')
      .then(response => response.json())
      .then(result=>{
          products = result;//guarda el resultado en el array productos
          console.log(products);
          showProducts(products)
      })
      .catch(error=>console.error(error));
  }
  
  getProducts()


  function showProducts(products){
      tabla.innerHTML= "";
      products.forEach(product => {
      const row = document.createElement('tr');
      const { nombre_producto, precio, cantidad, id_producto } = product;//esto es una desestructuracion de un objeto
         row.innerHTML = `
         <td>${nombre_producto}</td>
         <td>${precio}</td>
         <td><input type="number"  min="1" value="${cantidad}" class="form-control ActualizarCantidad" data-id="${id_producto}" style="width:50px"> </td>
         <td><a href="#" class="btn btn-danger eliminarProducto" data-id="${id_producto}"> X </a></td>
         <td><a href="#" class="btn btn-info editarProducto" data-id="${id_producto}">Editar</a></td>
     `;
        tabla.appendChild(row);
         const eliminar = row.querySelector('.eliminarProducto');
         eliminar.addEventListener('click',eliminarProducto);
       const editar = row.querySelector('click',editarProducto);
        //    editar.addEventListener(CLICK,editarProducto);
    
    
       });
    
    
        }

       function eliminarProducto(e) {
      const id= parseInt(e.target.getAttribute('data-id'));
      console.log(id);
      
      Swal.fire({
          title: 'Realmente deseas eliminar este producto',
          icon: 'warning',
          showConfirmButton:true,
          showCancelButton:true,
          confirmButtonColor:'#d03',
        })
      .then(result=>{
          if (result.isConfirmed) {
              fetch(`http://localhost/Api/productos/DeleteProducto?id=${id}`,{
                  method: 'DELETE',
                  headers: {
                      'Content -Type':'application/json'
                  }
              })
              .then(result=>{
                  console.log(result);
                  getProducts();
              })
              .catch(error=>{
                  Swal.fire('No se pudo borrar');
                  console.log(`No se pudo eliminar ${error}`);
              })
          } else {
              Swal.fire('No se borro')
          }
      })

  }
  const Titulo = document.getElementById('Modal-title');
  const Crear = document.getElementById('crear');
  const Guardar = document.getElementById('guardar');

  crear.addEventListener('click', ()=>{
      titulo.textContent='Crear producto';
      modal.show();

      const nombre = document.getElementById('nombre').value="";
      const precio = document.getElementById('precio').value="";
      const cantidad = document.getElementById('cantidad').value="";
      const valorMarca = document.getElementById('marca').value="";
      guardar.addEventListener('click', CreateProduct);
  })

  function CreateProduct() {
      const nombre = document.getElementById('nombre').value;
      const precio = document.getElementById('precio').value;
      const cantidad = document.getElementById('cantidad').value;
      const valorMarca = document.getElementById('marca').value;
      
      fetch('http://localhost/api/productos/CreateProducto',{
          method:'POST',
          headers:{
              'Content-Type':'application/json'
          },
          body: JSON.stringify({
              nombre_producto : nombre,
              precio : precio,
              cantidad : cantidad,
              marca : valorMarca
          })
      }).then(response=>{
          if (response.status === 200) {
              Swal.fire({
                  title : 'Producto creado exitosamente',
                  icon : 'success'
              })
              getProducts();
              console.log(response);
              modal.hide();
          } else {
              Swal.fire({
                  title : 'No se pudo crear el producto',
                  icon : 'error'
              })
          }
      })
      .catch(error=>{
          Swal.fire({
              title : 'Error',
              icon : 'error'
          })
          console.log(error);
      })
  }
  function updateProduct(e) {
      cleanField();
      // const products = getProducts();
      // console.log(products);
      
      const id = e.target.getAttribute('data-id');
      console.log(id);
      
     
      const product = products.find(product => product.id_producto === id);
      console.log(product);
      
      if (product) {
        document.getElementById('nombre').value = product.nombre_producto;
        document.getElementById('cantidad').value = product.cantidad;
        document.getElementById('precio').value = product.precio;
        document.getElementById('marca').value = product.marca;
      }
      
      modal.show();
      titulo.textContent = "Editar Producto";
      
      const guardar = document.getElementById('guardar');
      
      const nuevoGuardar = guardar.cloneNode(true);
      guardar.parentNode.replaceChild(nuevoGuardar, guardar);
      
      nuevoGuardar.addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value;
        const precio = parseFloat(document.getElementById('precio').value);
        const cantidad = parseInt(document.getElementById('cantidad').value);
        const valorMarca = document.getElementById('marca').value;
        
        console.log(id, nombre, precio, cantidad, valorMarca);
        
        fetch('http://localhost/api/productos/updateProducto', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id_producto: id,
            nombre_producto: nombre,
            precio: precio,
            cantidad: cantidad,
            marca: valorMarca
          })
        })
        .then(response => {
          if (response.status === 200) {
            Swal.fire({
              title: "Producto actualizado exitosamente",
              icon: 'success'
            });
            getProducts(); 
            modal.hide();  
          } else {
            Swal.fire({
              title: 'Datos inválidos o incompletos',
              icon: 'error'
            });
          }
        })
        .catch(error => {
          Swal.fire({
            title: "No se pudo actualizar el producto",
            icon: 'error'
          });
          console.error(error);
        });
      });
    }
    
    //fin funcion update
    
    
    
    
    // Lanza el modal
    const titulo = document.getElementById('Modal-title');
    const crear = document.getElementById('crear');
    const guardar = document.getElementById('guardar');
    
    guardar.addEventListener('click', CreateProduct);
    
    crear.addEventListener('click', () => {
      cleanField(); 
      modal.show();
      titulo.textContent = "Crear Producto";
    });
    
    function CreateProduct() {
      const nombre = document.getElementById('nombre').value;
      const precio = document.getElementById('precio').value;
      const cantidad = document.getElementById('cantidad').value;
      const valorMarca = document.getElementById('marca').value;
    
      console.log(nombre, precio, cantidad, valorMarca);
    
      fetch('http://localhost/api/productos/CreateProducto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre_producto: nombre,
          precio: precio,
          cantidad: cantidad,
          marca: valorMarca
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setTimeout(() => {
          Swal.fire('Producto creado exitosamente');
          getProducts(); 
          modal.hide(); 
        }, 500);
      })
      .catch(error => {
        Swal.fire('No se pudo crear el producto');
        console.error(error);
      });
    }
    
    function cleanField() {
      document.getElementById('nombre').value = '';
      document.getElementById('precio').value = '';
      document.getElementById('cantidad').value = '';
      document.getElementById('marca').value = '';
    }
    
  








})