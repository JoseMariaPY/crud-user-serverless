import os
import boto3
import json

client = boto3.resource('dynamodb')

IS_OFFLINE = os.getenv('IS_OFFLINE', False)
if IS_OFFLINE:
    boto3.Session(
        aws_access_key_id=os.getenv('ACCESS_KEY'),
        aws_secret_access_key=os.getenv('SECRET_KEY'),
        region_name= os.getenv('REGION')
    )
    client = boto3.resource('dynamodb', endpoint_url=os.getenv('ENDPOINT'))

def delete_user(event, context):
    
    # Obtener los datos del registro a actualizar
    id = event['pathParameters'].get('id')
    if not id:
        return {
            'statusCode': 400,
            'body': 'id is required'
        }
    #
    table = client.Table(os.getenv('DB_TABLE'))
    try:
        # Actualizar el registro en la tabla
        response = table.delete_item(
            Key={
                'pk': id
            }
        )
        
        # Responder con un mensaje de éxito
        response = {
            'statusCode': 200,
            'body': json.dumps('Registro eliminado exitosamente')
        }
    except Exception as e:
        # Manejar el error de DynamoDB
        response = {
            'statusCode': 500,
            'body': json.dumps(f'Error al eliminar el registro: {str(e)}')
        }
    
    return response
