create or replace PACKAGE BODY SAR_WEBAPP AS  

  PROCEDURE MONITOR_INTERFASES_ENTRADA(p_input_json  IN  CLOB, p_output_json OUT CLOB) AS
    v_json_obj     JSON_OBJECT_T;
    v_name         VARCHAR2(100) := NULL;
    v_response     JSON_OBJECT_T;
    v_data_array   JSON_ARRAY_T := JSON_ARRAY_T();
    v_sql_query    VARCHAR2(4000);
    v_cursor       SYS_REFCURSOR;

    -- Variables para recibir datos del FETCH
    v_codigo_interfase  SIR_INTERFASES_ENTRADA.CODIGO_INTERFASE%TYPE;
    v_nombre_fisico     SIR_INTERFASES_ENTRADA.NOMBRE_FISICO%TYPE;
    v_extension_fisica  SIR_INTERFASES_ENTRADA.EXTENSION_FISICA%TYPE;
    v_directorio        SIR_INTERFASES_ENTRADA.DIRECTORIO_UBICACION%TYPE;
    v_origen           SIR_INTERFASES_ENTRADA.ORIGEN_INTERFASE%TYPE;
    v_periodicidad     SIR_INTERFASES_ENTRADA.PERIODICIDAD%TYPE;
    v_descripcion      SIR_INTERFASES_ENTRADA.DESCRIPCION_INTERFASE%TYPE;
    v_posee_cabecera   SIR_INTERFASES_ENTRADA.POSEE_CABECERA%TYPE;
    v_posee_detalle    SIR_INTERFASES_ENTRADA.POSEE_DETALLE%TYPE;
    v_posee_totales    SIR_INTERFASES_ENTRADA.POSEE_TOTALES%TYPE;
    v_estado           SIR_INTERFASES_ENTRADA.ESTADO_INTERFASE%TYPE;
    v_tabla_bd         SIR_INTERFASES_ENTRADA.TABLA_BD%TYPE;
    v_tabla_origen     SIR_INTERFASES_ENTRADA.TABLA_ORIGEN%TYPE;
    v_pkg_validacion   SIR_INTERFASES_ENTRADA.PKG_VALIDACION%TYPE;
    v_tipo_origen      SIR_INTERFASES_ENTRADA.TIPO_ORIGEN%TYPE;
    v_vista_validacion SIR_INTERFASES_ENTRADA.VISTA_VALIDACION%TYPE;

  BEGIN
    -- Inicializar el CLOB de salida
    DBMS_LOB.CREATETEMPORARY(p_output_json, TRUE);

    -- Intentar parsear el JSON de entrada
    BEGIN
      v_json_obj := JSON_OBJECT_T.PARSE(p_input_json);
    EXCEPTION
      WHEN OTHERS THEN
        p_output_json := '{"error": "Invalid JSON format"}';
        RETURN;
    END;

    -- Obtener el valor de `name` si está presente en el JSON
    BEGIN
      v_name := v_json_obj.get_string('name');
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        v_name := NULL;  -- Si `name` no existe, no aplicar filtro
    END;

    -- Construcción dinámica de la consulta (siempre se reconstruye)
    v_sql_query := 'SELECT CODIGO_INTERFASE, NOMBRE_FISICO, EXTENSION_FISICA, DIRECTORIO_UBICACION, ' ||
                   'ORIGEN_INTERFASE, PERIODICIDAD, DESCRIPCION_INTERFASE, POSEE_CABECERA, ' ||
                   'POSEE_DETALLE, POSEE_TOTALES, ESTADO_INTERFASE, TABLA_BD, TABLA_ORIGEN, ' ||
                   'PKG_VALIDACION, TIPO_ORIGEN, VISTA_VALIDACION ' ||
                   'FROM SIR_INTERFASES_ENTRADA';

    -- Agregar WHERE solo si `v_name` tiene un valor válido
    IF v_name IS NOT NULL AND TRIM(v_name) <> '' THEN
      v_sql_query := v_sql_query || ' WHERE ORIGEN_INTERFASE = :v_name';
    END IF;

    -- Ejecutar consulta con o sin filtro
    IF v_name IS NOT NULL AND TRIM(v_name) <> '' THEN
      OPEN v_cursor FOR v_sql_query USING v_name;
    ELSE
      OPEN v_cursor FOR v_sql_query;
    END IF;

    -- Recorrer los resultados y construir JSON
    v_data_array := JSON_ARRAY_T();  -- Reiniciar el array cada vez que se ejecuta

    LOOP
      FETCH v_cursor INTO v_codigo_interfase, v_nombre_fisico, v_extension_fisica, v_directorio,
                        v_origen, v_periodicidad, v_descripcion, v_posee_cabecera,
                        v_posee_detalle, v_posee_totales, v_estado, v_tabla_bd, 
                        v_tabla_origen, v_pkg_validacion, v_tipo_origen, v_vista_validacion;
      EXIT WHEN v_cursor%NOTFOUND;

      DECLARE v_row_data JSON_OBJECT_T;
      BEGIN
        v_row_data := JSON_OBJECT_T();
        v_row_data.put('CODIGO_INTERFASE', v_codigo_interfase);
        v_row_data.put('NOMBRE_FISICO', v_nombre_fisico);
        v_row_data.put('EXTENSION_FISICA', v_extension_fisica);
        v_row_data.put('DIRECTORIO_UBICACION', v_directorio);
        v_row_data.put('ORIGEN_INTERFASE', v_origen);
        v_row_data.put('PERIODICIDAD', v_periodicidad);
        v_row_data.put('DESCRIPCION_INTERFASE', v_descripcion);
        v_row_data.put('POSEE_CABECERA', v_posee_cabecera);
        v_row_data.put('POSEE_DETALLE', v_posee_detalle);
        v_row_data.put('POSEE_TOTALES', v_posee_totales);
        v_row_data.put('ESTADO_INTERFASE', v_estado);
        v_row_data.put('TABLA_BD', v_tabla_bd);
        v_row_data.put('TABLA_ORIGEN', v_tabla_origen);
        v_row_data.put('PKG_VALIDACION', v_pkg_validacion);
        v_row_data.put('TIPO_ORIGEN', v_tipo_origen);
        v_row_data.put('VISTA_VALIDACION', v_vista_validacion);

        v_data_array.append(v_row_data);
      END;
    END LOOP;

    -- Cerrar cursor
    IF v_cursor%ISOPEN THEN
      CLOSE v_cursor;
    END IF;

    -- Crear una respuesta JSON
    v_response := JSON_OBJECT_T();
    v_response.put('name', v_name);
    v_response.put('status', 'Processed successfully');
    v_response.put('data', v_data_array);  -- Agregar los datos al JSON

    -- Convertir el objeto JSON a CLOB para la salida (forma segura)
    p_output_json := v_response.TO_CLOB();

  EXCEPTION
    WHEN OTHERS THEN
      IF v_cursor%ISOPEN THEN
        CLOSE v_cursor;
      END IF;
      p_output_json := '{"error": "Unexpected error occurred"}';
  END MONITOR_INTERFASES_ENTRADA;

END SAR_WEBAPP;