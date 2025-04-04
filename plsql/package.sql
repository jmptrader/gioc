create or replace PACKAGE SAR_WEBAPP AS  
  -- Declaración de una función
  PROCEDURE MONITOR_INTERFASES_ENTRADA (p_input_json  IN  CLOB,p_output_json OUT CLOB);
END SAR_WEBAPP;
