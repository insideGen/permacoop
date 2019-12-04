import {mock, instance, when, verify} from 'ts-mockito';
import {GetProjectsQueryHandler} from 'src/Application/Project/Query/Project/GetProjectsQueryHandler';
import {ProjectRepository} from 'src/Infrastructure/Project/Repository/ProjectRepository';
import {GetProjectsQuery} from 'src/Application/Project/Query/Project/GetProjectsQuery';
import {Project} from 'src/Domain/Project/Project.entity';
import {ProjectView} from 'src/Application/Project/View/ProjectView';
import {Customer} from 'src/Domain/Customer/Customer.entity';
import {CustomerView} from 'src/Application/Customer/View/CustomerView';

describe('GetProjectsQueryHandler', () => {
  it('testGetProjects', async () => {
    const projectRepository = mock(ProjectRepository);

    const customer1 = mock(Customer);
    when(customer1.getId()).thenReturn('58958f69-d104-471b-b780-bbb0ec6c52da');
    when(customer1.getName()).thenReturn('Radio France');

    const customer2 = mock(Customer);
    when(customer2.getId()).thenReturn('b9a9b094-5bb2-4d0b-b01e-231b6cb50039');
    when(customer2.getName()).thenReturn('Proximum');

    const project1 = mock(Project);
    when(project1.getId()).thenReturn('eb9e1d9b-dce2-48a9-b64f-f0872f3157d2');
    when(project1.getName()).thenReturn('z51');
    when(project1.getCustomer()).thenReturn(instance(customer1));

    const project2 = mock(Project);
    when(project2.getId()).thenReturn('d54f15d6-1a1d-47e8-8672-9f46018f9960');
    when(project2.getName()).thenReturn('BO cruiser');
    when(project2.getCustomer()).thenReturn(instance(customer1));

    const project3 = mock(Project);
    when(project3.getId()).thenReturn('992eb372-cc02-4ffe-86e0-7b955b7f1a6e');
    when(project3.getName()).thenReturn('Vimeet');
    when(project3.getCustomer()).thenReturn(instance(customer2));

    when(projectRepository.findProjects()).thenResolve([
      instance(project3),
      instance(project2),
      instance(project1)
    ]);

    const queryHandler = new GetProjectsQueryHandler(
      instance(projectRepository)
    );

    const expectedResult = [
      new ProjectView(
        '992eb372-cc02-4ffe-86e0-7b955b7f1a6e',
        'Vimeet',
        new CustomerView('b9a9b094-5bb2-4d0b-b01e-231b6cb50039', 'Proximum')
      ),
      new ProjectView(
        'd54f15d6-1a1d-47e8-8672-9f46018f9960',
        'BO cruiser',
        new CustomerView('58958f69-d104-471b-b780-bbb0ec6c52da', 'Radio France')
      ),
      new ProjectView(
        'eb9e1d9b-dce2-48a9-b64f-f0872f3157d2',
        'z51',
        new CustomerView('58958f69-d104-471b-b780-bbb0ec6c52da', 'Radio France')
      )
    ];

    expect(await queryHandler.execute(new GetProjectsQuery())).toMatchObject(
      expectedResult
    );
    verify(projectRepository.findProjects()).once();
  });

  it('testGetEmptyProjects', async () => {
    const projectRepository = mock(ProjectRepository);

    when(projectRepository.findProjects()).thenResolve([]);

    const queryHandler = new GetProjectsQueryHandler(
      instance(projectRepository)
    );

    expect(await queryHandler.execute(new GetProjectsQuery())).toMatchObject(
      []
    );
    verify(projectRepository.findProjects()).once();
  });
});