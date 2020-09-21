var productos = [];
var reciente = [];
var ordenesTemp = [];
var recienteOrdenes=[];
var itemsOrdenesTemp =[];
var recientesItems = [];
var itemsStock = [];

//Objeto usuario
function objUsuario(idUsuario, tipoUsuario){
	this.idUsuario = idUsuario,
	this.tipoUsuario = tipoUsuario
}

//Funcion recibe los datos para la orden de compra 
function objOrden(codigoOrden, fechaCreacion, fechaEntrega, idProveedor, estado){
	
	this.codigoOrden = codigoOrden,
	this.fechaCreacion = fechaCreacion,
	this.fechaEntrega = fechaEntrega,
	this.idProveedor = idProveedor,
	this.estado = estado
	
}

// Funcion para almacenar los items de la orden de compra
function objOrdenItems(codigoOrden, codigoProducto, nombreProducto, precio, cantidad){
	this.codigoOrden = codigoOrden,
	this.codigoProducto = codigoProducto,
	this.nombreProducto = nombreProducto,
	this.precio = precio,
	this.cantidad = cantidad
	
}

//Objeto stock
function objStockItems(codigoProducto, codigoOrden, cantidad, precio, estado){
	this.codigoProducto = codigoProducto,
	this.codigoOrden = codigoOrden,
	this.cantidad = cantidad,
	this.precio = precio,
	this.estado = estado
	
}


// Limpiar datos de autenticacino del usuario
function limpiarAutentiacion(){
	datosUsuario = JSON.parse(localStorage.getItem("usuario"));
	if(datosUsuario != null){

		localStorage.removeItem("usuario");
	}	
}

//Realizar el login
function enviarform(){
	error.style.color='red';
	
	const usuarioadmin = "admin";
	const contrasenaadmin ="1234";

	const usuariodueno = "dueno";
	const contrasenadueno ="1234";
	
	
	let idUsuario = document.getElementById("idUsuario").value;
	let contrasenaUsuario = document.getElementById("contrasena").value;
	
	let errores = 0;
	
	var mensajeError = [];

	if (idUsuario===""){
		mensajeError.push('Ingresa tu Nombre');
		errores++; 
	}
	if (contrasenaUsuario===""){
		mensajeError.push('Ingresa tu contrasena');
		errores++;
	}
	
	if(idUsuario == usuarioadmin && contrasenaUsuario == contrasenaadmin){

		var usu = new objUsuario(usuariodueno, 1);
		localStorage.removeItem("usuario");
		localStorage.setItem("usuario", JSON.stringify(usu));
		window.location.replace("monitoreoOrden.html");

	} else if(idUsuario == usuariodueno && contrasenaUsuario == contrasenadueno ){
		var usu = new objUsuario(usuariodueno, 2);
		localStorage.removeItem("usuario");
		localStorage.setItem("usuario", JSON.stringify(usu));
		window.location.replace("ordenCompra.html");
	}
	else{
		mensajeError.push('Datos del usuario inválidos');
		errores++;
	}
	
	if(errores > 0) {
		error.innerHTML=mensajeError.join(' , ');	
		console.log(errores)
		return false;
		
		
	}
	return false;
	
}


//Validar permiso de usuario por pagina
function validarPermisos(tipoPermiso){

	datosUsuario = JSON.parse(localStorage.getItem("usuario"));

	if(datosUsuario != null){

		if(datosUsuario.tipoUsuario != tipoPermiso){
			window.location.replace("errorPermisos.html");
		}
		console.log(datosUsuario.idUsuario)

	} else{

		window.location.replace("login.html");
	}
}




//Valida que haya informacion en todos los campos
function validar(){
	
	

	if(document.getElementById("idCodigo").value == ""){
		alert("Hace falta ingresar el código del producto!");
		return false;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("Hace falta ingresar el nombre del producto!");
		return false;
	}

	if(document.getElementById("idPrecio").value == ""){
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

	if (document.getElementById("idImagen").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

}

function getFile(){
	var resultado="";
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.addEventListener("load", function(){
		resultado = reader.result;
		sessionStorage.setItem("url", resultado);
	},false);

	if (file){
		reader.readAsDataURL(file);
	}
}
//El arreglo en donde se van a almacenar todos los datos en el ingreso de productos
function llenarArreglo(){
	var codigo = document.getElementById("idCodigo").value;
	var nombre = document.getElementById("idNombre").value;
	var precio = document.getElementById("idPrecio").value;
	var imagen = sessionStorage.getItem("url");

	var codigoExiste = false;

	//Agregar el producto al local storage
	if(localStorage.getItem("registro") != null){
		productos = JSON.parse(localStorage.getItem("registro"));
		
		//Recoger el arreglo de productos
		for(var i=0; i<productos.length; i++){
			//Validacion que no puedan haber dos codigos iguales
			if (productos[i].codigo == codigo) {
				codigoExiste = true;
				alert("EL CODIGO INGRESADO YA EXISTE!");
			}

		}
	}

	//Si el codigo no existe
	if(codigoExiste == false){
		
		//Crea el objeto y lo guarda en prod y luego limpia la pantalla 
		var prod = new objproducto(codigo, nombre, precio, imagen,0);
		reciente.push(prod);
		productos.push(prod);
		//localStorage.clear();
		localStorage.removeItem("registro");
		localStorage.setItem("registro", JSON.stringify(productos));
	}
	
}



//Funcion recibe los datos 
function objproducto(codigo, nombre, precio, imagen, cantidad = 0){
	this.codigo = codigo,
	this.nombre = nombre,
	this.precio = precio,
	this.imagen = imagen,
	this.cantidad = cantidad
}
//Actualiza la tabla de productos 
function actualizarTabla(){
	//debugger;
	var scriptTabla="";
	for(var index=0; index<reciente.length; index++){
		scriptTabla+="<tr>";
		scriptTabla+="<td>"+reciente[index].codigo+"</td>";
		scriptTabla+="<td>"+reciente[index].nombre+"</td>";
		scriptTabla+="<td>Q "+reciente[index].precio+"</td>";
		scriptTabla+="<td><img src=\""+reciente[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";
	}
	document.getElementById("idTableBody").innerHTML = scriptTabla;
}
//Limpia
function limpiar(){
	document.getElementById("idCodigo").value = "";
	document.getElementById("idNombre").value = "";
	document.getElementById("idPrecio").value = "";
	document.getElementById("idImagen").value = "";
}

//Muestra todos los productos guardados
function mostrarProductos(){
	var guardados = [];
	guardados = JSON.parse(localStorage.getItem("registro"));

	var scriptTabla;
	//Recorre el arreglo de productos
	for(var index=0; index<guardados.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+guardados[index].codigo+"</td>";
		scriptTabla+="<td>"+guardados[index].nombre+"<br><br><label for=\""+guardados[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+guardados[index].codigo+"\"></td>";
		scriptTabla+="<td>Q "+guardados[index].precio+"<br><br><input type=\"button\" value=\"Agregar al carrito\" id=\""+guardados[index].codigo+"\" onclick=\"agregarCarrito(this.id)\"></td>";
		scriptTabla+="<td><img src=\""+guardados[index].imagen+"\" width=\"75px\"></td>";
		scriptTabla+="</tr>";
	}
	//La propiedad innerHTML por medio de un ID nos sirve para cambiar o recuperar datos de una etiqueta, div, p etc
	document.getElementById("idTableBody2").innerHTML = scriptTabla;

}
//Objeto para el pedido
function objpedido(codigo, nombre, precio, imagen, cantidad){
	this.codigo=codigo,
	this.nombre=nombre,
	this.precio=precio,
	this.imagen=imagen,
	this.cantidad=cantidad
}

//Funcion para agregar al carrito
function agregarCarrito(id){

	//debugger;
//variables
	var buscarProductos = [];
	var auxiliar = [];
	var getProducto = [];

	var codigo;
	var nombre;
	var precio;
	var imagen;
	var cantidad;

	buscarProductos = JSON.parse(localStorage.getItem("registro"));

	for(var i=0; i<buscarProductos.length; i++){

		if(buscarProductos[i].codigo == id){
			codigo = buscarProductos[i].codigo;
			nombre = buscarProductos[i].nombre;
			precio = buscarProductos[i].precio;
			imagen = buscarProductos[i].imagen;
			cantidad = document.getElementById("c"+id).value;
		}

	}
	//Valida que el carrito no este vacio
	if(cantidad != "" && cantidad > 0){
		//Guarda la info rn el sesionStorage
		if(JSON.parse(sessionStorage.getItem("regPedido"))!=null){

			var actualizar = false;

			auxiliar = JSON.parse(sessionStorage.getItem("regPedido"));
			//Recorre el arrelo auxiliar para y acualia
			for(var y=0; y<auxiliar.length; y++){
				if(auxiliar[y].codigo == codigo){
					actualizar = true;
					break;
				}
			}
			//Recogge el arreglo para agregala
			if(actualizar == true){
				for(var z=0; z<auxiliar.length; z++){
					if(auxiliar[z].codigo != codigo){
						getProducto.push(auxiliar[z]);
					}
				}

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);
				//agrega
				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
			}else{

				getProducto = auxiliar;

				var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

				getProducto.push(ped);

				sessionStorage.clear();
				sessionStorage.setItem("regPedido", JSON.stringify(getProducto));

			}

		}else{
			var ped = new objpedido(codigo, nombre, precio, imagen, cantidad);

			getProducto.push(ped);

			sessionStorage.clear();
			sessionStorage.setItem("regPedido", JSON.stringify(getProducto));
		}

	}else{

		alert("NO SE HA INGRESADO UNA CANTIDAD!");

	}

}

//Metodo para revisar el pedido se llama en ConfirmarPedido
function revisarPedido(){
	var carrito = [];
	var total = 0;
	//Variable sessionStorage para el registro del pedido
	carrito = JSON.parse(sessionStorage.getItem("regPedido"));

	var scriptTabla;
//Recorre el carrito
	for(var index=0; index<carrito.length; index++){

		scriptTabla+="<tr>";
		scriptTabla+="<td>"+carrito[index].codigo+"</td>";
		scriptTabla+="<td>"+carrito[index].nombre+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src=\""+carrito[index].imagen+"\" width=\"75px\"></td>"
		scriptTabla+="<td>"+carrito[index].cantidad+"<br><br><label for=\""+carrito[index].codigo+"\">Cantidad: </label> <input type=\"number\" id=\""+"c"+carrito[index].codigo+"\" onchange=\"actualizarCantidad(this.id)\">&nbsp;&nbsp;&nbsp;&nbsp;<input type=\"button\" value=\"Descartar\" id=\""+carrito[index].codigo+"\" onclick=\"quitarCarrito(this.id)\"></td>";
		scriptTabla+="<td>Q "+carrito[index].precio+"</td>";
		scriptTabla+="<td>Q "+carrito[index].cantidad*carrito[index].precio+"</td>";
		scriptTabla+="</tr>";
		total+=carrito[index].cantidad*carrito[index].precio;
	}
//Obtiene la informacion con el InnerHTML
	document.getElementById("idTableBody3").innerHTML = scriptTabla;
	document.getElementById("total").innerHTML = "Total compra:&nbsp;&nbsp;&nbsp;&nbsp;Q "+total;
}

//Permite cambiar la cantiad solicitada
function actualizarCantidad(id){
	var nuevoid = id.substring(1);
	
	agregarCarrito(nuevoid);

	revisarPedido();
}

//Funcion Eliminar o descartar del carrito
function quitarCarrito(id){

	var pedidoActual = [];
	var nuevoPedido = [];

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	for(var y=0; y<pedidoActual.length; y++){
		if(pedidoActual[y].codigo != id){
			nuevoPedido.push(pedidoActual[y]);
		}
	}

	sessionStorage.clear();
	sessionStorage.setItem("regPedido", JSON.stringify(nuevoPedido));

	revisarPedido();

}
//Confirmar compra
function validarCompra(){

	var total = document.getElementById("total");
	var contenido = total.innerHTML;

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	if(pedidoActual == null){

		alert("No se han agregado productos al carrito")
		return;
	}

	if(document.getElementById("idNombre").value == ""){
		alert("DEBE INGRESAR SU NOMBRE COMPLETO!");
		return false;
	}

	if(document.getElementById("idDir").value == ""){
		alert("DEBE INGRESAR UNA DIRECCION DE ENTREGA!");
		return false;
	}

}
//Funcion comorar
function comprar(){

	if(validarCompra()==false){
		return false;
	}

	document.getElementById("idNit").value="";
	document.getElementById("idNombre").value="";
	document.getElementById("idDir").value="";

	pedidoActual = JSON.parse(sessionStorage.getItem("regPedido"));

	

	itemsStock = JSON.parse(localStorage.getItem("stock"));

	for(var m=0; m<pedidoActual.length; m++){

		//console.log(pedidoActual[m])

		for(var j=0; j<itemsStock.length; j++){	

			//Verificar si hay un producto vigente en stock (estado 1)
			if(itemsStock[j].codigoProducto == pedidoActual[m].codigo && itemsStock[j].estado == 1){
				
				var cantidadAnt = parseInt(itemsStock[j].cantidad,10);
				var cantidadNueva = cantidadAnt - parseInt(pedidoActual[m].cantidad,10);
				console.log(cantidadNueva);
				var stock = new objStockItems(pedidoActual[m].codigo, 
					itemsStock[j].codigoOrden, 
					cantidadNueva, 
					itemsStock[j].precio, 
					1);
				
				itemsStock[j].cantidad = cantidadNueva;
				registroAnterior = true;

				//itemsStock.push(stock);
				localStorage.removeItem("stock");
				localStorage.setItem("stock", JSON.stringify(itemsStock));

			}

			
		}

				
	}
	document.getElementById("idTableBody3").innerHTML = "";
	sessionStorage.removeItem("regPedido");




	//sessionStorage.clear();

	alert("Su pedido se registro correctamente!\n Muchas gracias por su compra!");
	window.location.replace("mostrarProductos.html?msg=compra");
	

}

function agregarProducto(){

	if(validar()==false){
		return false;
	}

	llenarArreglo();

	actualizarTabla();

	limpiar();

}


function validarform(){
	
	
	

	if(document.getElementById("idNombre").value == ""){
		alert("Hace falta ingresar el código del producto!");
		return false;
	}

	if(document.getElementById("idApellido").value == ""){
		alert("Hace falta ingresar el nombre del producto!");
		return false;
	}

	if(document.getElementById("idDireccion").value == ""){
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

	if (document.getElementById("idGmail").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}
	if (document.getElementById("idContrasena").value == "") {
		alert("Hace falta ingresar el Precio del producto!");
		return false;
	}

}

var nombre = document.getElementById ('idNombre');
var contrasena = document.getElementById ('idContrasena');
var error = document.getElementById('error');





function validarlogin()
{

}


/*
updatetable(){
}

limpiarTabla(){

}
*/






var arrProds = [];
function AgregarOC(){
	
	//console.log("agregando")
	var fecha = new Date();
	var codigoOrden = document.getElementById("idOrden").value;
	var fechaEntrega = document.getElementById("fechaE").value;
	var idProveedor = document.getElementById("idProv").value;
	var fechaActual = fecha.getDate() + "/"+ fecha.getMonth()+ "/" +fecha.getFullYear();
	
	var codigoProd = document.getElementById("idProd").value;
	var cantProd = document.getElementById("cantP").value;
	
	if(codigoOrden === "" || fechaEntrega === "" || idProveedor === "" || codigoProd === "" || cantProd === ""){
		
		alert("No se han compleatado los datos requeridos");
		return false;
		
	}
	
	
	var codigoExiste = false;
	
	
	//Verificar si existe la orden de compra para almacenarla
	var existeOrden = false;
	var ordenes = JSON.parse(localStorage.getItem("ordenes"))
	if(ordenes != null){
		ordenesTemp = JSON.parse(localStorage.getItem("ordenes"));
		//Recoger el arreglo de ordenes para verificar que no exista la ingresada
		for(var i=0; i<ordenes.length; i++){
			if(ordenes[i].codigoOrden == codigoOrden){
				existeOrden = true;
				
			}
		}
				
	}
	
	if(!existeOrden){
		var orden = new objOrden(codigoOrden, fechaActual, fechaEntrega, idProveedor, 1);
		
		
		
		recienteOrdenes.push(orden);
		ordenesTemp.push(orden);
		
		localStorage.removeItem("ordenes");
		localStorage.setItem("ordenes", JSON.stringify(ordenesTemp));
	}

	//console.log(existeOrden)
	
	
	
	
	
	//Buscar producto segun codigo codigoP
	
	if(localStorage.getItem("registro") != null){
		productos = JSON.parse(localStorage.getItem("registro"));

		//Recoger el arreglo de productos
		for(var i=0; i<productos.length; i++){
			//Validacion que no puedan haber dos codigos iguales
			if (productos[i].codigo == codigoProd) {
				
				if(localStorage.getItem("ordenItems") != null){
					itemsOrdenesTemp = JSON.parse(localStorage.getItem("ordenItems"));
				}
				var prod = new objOrdenItems(codigoOrden, productos[i].codigo, productos[i].nombre, productos[i].precio, cantProd);
				
				
				recientesItems.push(prod);
				itemsOrdenesTemp.push(prod);
				
				
				
				localStorage.removeItem("ordenItems");
				localStorage.setItem("ordenItems", JSON.stringify(itemsOrdenesTemp));
				
				codigoExiste = true;
				
			}

		}
	}
	
	//console.log(arrProds);
	//return;
	
	
	if(!codigoExiste){
		alert("No se encontró el producto solicitado");
	} else{
		
		var scriptTabla="";
		for(var index=0; index<recientesItems.length; index++){
			scriptTabla+="<tr>";
			scriptTabla+="<td>"+recientesItems[index].codigoProducto+"</td>";
			scriptTabla+="<td>"+recientesItems[index].nombreProducto+"</td>";
			scriptTabla+="<td>Q "+recientesItems[index].precio+"</td>";
			scriptTabla+="<td>"+recientesItems[index].cantidad+"</td>";
			
			var subTotal = recientesItems[index].precio * recientesItems[index].cantidad;
			
			scriptTabla+="<td>Q "+subTotal+"</td>";
			scriptTabla+="</tr>";
		}
		
		document.getElementById("tablaProductosBody").innerHTML = scriptTabla;
		
		document.getElementById("idProd").value = "";
		document.getElementById("cantP").value = "";
		document.getElementById("idProd").select();
		
		
	}
	
	/*
	var prod = new objproducto(codigo, nombre, precio, imagen,0);
	arrProds.push(prod);
	
	console.log(arrProds);
	*/

}


function nuevaOrden(){
	document.getElementById("tablaProductosBody").innerHTML = "";
	document.getElementById("idOrden").value = "";
	document.getElementById("fechaE").value = "";
	document.getElementById("idProv").value ="" ;
	
	document.getElementById("idOrden").select();
	recientesItems = [];
	
}


/////// MONITOREO DE ORDEN DE COMPRA /////////////////
function cargarOrdenes(){
	
	ordenes = JSON.parse(localStorage.getItem("ordenes"));
	if(ordenes != null){
		
		var scriptTabla = "";
		for(var index=0; index<ordenes.length; index++){
			scriptTabla+="<tr>";
			scriptTabla+="<td>"+ordenes[index].codigoOrden+"</td>";
			scriptTabla+="<td>"+ordenes[index].idProveedor+"</td>";
			scriptTabla+="<td>"+ordenes[index].fechaCreacion+"</td>";
			scriptTabla+="<td>"+ordenes[index].fechaEntrega+"</td>";
			
			var estado = "Solicidado";
			if(ordenes[index].estado == 2){
				estado = "En ruta";
			} if(ordenes[index].estado == 3){
				estado = "Entregado";
			}
			
			
			// Recorrer los items de cada orden para sumar el total
			var totalOrden = 0;
			var ordenesItems = JSON.parse(localStorage.getItem("ordenItems"));
			if(ordenesItems != null){
				
				for(var indexItems=0; indexItems<ordenesItems.length; indexItems++){
				
					if(ordenesItems[indexItems].codigoOrden == ordenes[index].codigoOrden){
						
						totalOrden += ( ordenesItems[indexItems].precio * ordenesItems[indexItems].cantidad );
						
					}
				
				}
				
				
			}
			var listaEstado = "<select class='form-control estadoOrden' id='"+ordenes[index].codigoOrden+"' ";
								if(ordenes[index].estado ==3){
									listaEstado += " disabled ";
								}
			
			
			
						listaEstado += ">" +
			                  "<option value='1' "; 
							  
							  if(ordenes[index].estado == 1){
								listaEstado += "selected" 
							  }
							
						listaEstado += ">Solicitado</option>" +
							  "<option value='2' ";
							  
							  if(ordenes[index].estado == 2){
								listaEstado += "selected" 
							  }
							  
					    listaEstado += ">En Ruta</option>" +
							  "<option value='3' ";
							  
							  if(ordenes[index].estado == 3){
								listaEstado += "selected" 
							  }
					    listaEstado += ">Entregado</option></select>"
			
			scriptTabla+="<td>"+listaEstado+"</td>";
			
			scriptTabla+="<td>Q" + totalOrden + "</td>";
			//var subTotal = ordenes[index].precio * ordenes[index].cantidad;
			
			//scriptTabla+="<td>Q "+subTotal+"</td>";
			scriptTabla+="</tr>";
		}
		document.getElementById("tablaOrdenesBody").innerHTML = scriptTabla;
		
	}
	
}

/* Cambio de estado a orden de compra */

$(document).on('change', '.estadoOrden', function() {
	
	var idSelectOrden= this.id;
	var nuevoEstado = this.value;
	var temp = [];
	
	
	console.log(nuevoEstado);
	//Recorrer storage de ordenes para buscar segun el codigo 
	var busquedaOrdenes = JSON.parse(localStorage.getItem("ordenes"));
	
	if(busquedaOrdenes != null){
		for(var i=0; i<busquedaOrdenes.length; i++){
			
			if(busquedaOrdenes[i].codigoOrden == idSelectOrden){
				
				
				
				busquedaOrdenes[i].estado = nuevoEstado;
				localStorage.removeItem("ordenes");
				localStorage.setItem("ordenes", JSON.stringify(busquedaOrdenes));
				
				
				//console.log("encontrado "  + busquedaOrdenes[i].idProveedor)
				
				
				// Agregar al stock si el estado es 3
				if(nuevoEstado == 3){
					
					// Desabilitar el dropdown si el estado es 3
					$(this).attr('disabled');
					
					if(JSON.parse(localStorage.getItem("stock") != null)){
						itemsStock = JSON.parse(localStorage.getItem("stock"));
					}
					var ordenesItems = JSON.parse(localStorage.getItem("ordenItems"));
					
					if(ordenesItems != null){
						//Recorrer los items de la orden para agregarlos al stock
						for(var q=0; q<ordenesItems.length; q++){
							console.log(q)
							if(ordenesItems[q].codigoOrden == busquedaOrdenes[i].codigoOrden){
								var registroAnterior = false;
								//verificar que el stock no esté vacío
								if(itemsStock != null){
									
									for(var j=0; j<itemsStock.length; j++){	

										//Verificar si hay un producto vigente en stock (estado 1)
										if(itemsStock[j].codigoProducto == ordenesItems[q].codigoProducto && itemsStock[j].estado == 1){
											itemsStock[j].estado = 0;
											var cantidadAnt = parseInt(itemsStock[j].cantidad,10);
											var cantidadNueva = cantidadAnt + parseInt(ordenesItems[q].cantidad,10);
											console.log(cantidadAnt);
											var stock = new objStockItems(ordenesItems[q].codigoProducto, 
												ordenesItems[q].codigoOrden, 
												cantidadNueva, 
												ordenesItems[q].precio, 
												1);

											registroAnterior = true;

										}

										
									}

								}

								if(registroAnterior == false){

									var stock = new objStockItems(ordenesItems[q].codigoProducto, 
										ordenesItems[q].codigoOrden, 
										ordenesItems[q].cantidad,
										ordenesItems[q].precio, 
										1);

								}
								
								//console.log(stock)
								itemsStock.push(stock);
								localStorage.removeItem("stock");
								localStorage.setItem("stock", JSON.stringify(itemsStock));							
								
								
							}
						
						}
						
					}
					
				}

				alert("Se ha cambiado el estado correctamente a la orden No " + idSelectOrden );
			}
			
		}
		
	}
	
	itemsStock =[]
	
});


/***************************************/



///////////////////////////////////////////////////



/////////////////// STOCK DE PRODUCTOS ///////////////////////
function obtenerStock(){
	
	itemsStock = JSON.parse(localStorage.getItem("stock"));
	//console.log(itemsStock.length)
	productos = JSON.parse(localStorage.getItem("registro"));

	if(itemsStock != null){
		var tablaStock = "";
		for(var k=0; k<itemsStock.length; k++){	

			if(itemsStock[k].estado == 1){

				if(productos != null){

					for(var l=0; l<productos.length; l++){
						
						if(itemsStock[k].codigoProducto == productos[l].codigo){
							tablaStock += "<tr>" +
								"<td>"+itemsStock[k].codigoProducto+"</td>"+
								"<td>"+productos[l].nombre+"</td>"+
								"<td>"+itemsStock[k].cantidad+"</td>"+
								"<td>"+itemsStock[k].precio+"</td></tr>";
						}
					}

				}
				//console.log(itemsStock[k].cantidad);
			}

		}


		//Mostrar los datos en la tabla
		document.getElementById("tablaStockBody").innerHTML = tablaStock;
	}
	

}


//////////////////////////////////////////////////////////////


