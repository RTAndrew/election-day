import React from 'react'
import { prisma } from '../../utils/database';
import type { FastifyReply, FastifyRequest } from 'fastify';

export const findDistricts = async (_request: FastifyRequest, response: FastifyReply) => {
  const districts = await prisma.districts.findMany({
    include: {
      votes: {
        include: {
          party: true,
        }
      }
    }
  });

  response.send({
    status: 200,
    data: districts,
  });
}